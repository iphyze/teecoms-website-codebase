'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { site } from '@/config/site'
import Button from '@/components/ui/Button'
import styles from './ContactForm.module.css'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
// Where enquiries are posted. Default: the PHP mailer shipped in public/api/contact.php.
// NEXT_PUBLIC_CONTACT_ENDPOINT overrides it; NEXT_PUBLIC_API_BASE_URL keeps the older `${base}/contact` option.
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT
  || (API_BASE_URL.trim() ? `${API_BASE_URL.replace(/\/+$/, '')}/contact` : '/api/contact.php')
// Optional Cloudflare Turnstile (free, usually invisible human check). Set the site key in .env
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
// Keep in step with CONTACT_MIN_SECONDS on the server (default 3s)
const MIN_FILL_MS = 3500
const MESSAGES = {
  verify: 'We couldn’t confirm you’re not a bot. Please try again.',
  verifying: 'Just a moment: we’re checking you’re not a bot. Press Send again in a few seconds.',
  rateLimited: 'You’ve sent several messages in a short time. Please wait a few minutes and try again.',
}

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const fieldError = (error, id, styles) => error ? (
  <span className={styles.error} id={id} role="alert">{error.message}</span>
) : null

/** Submission is only marked successful after a real 2xx API response. */
export default function ContactForm({ content, services }) {
  const [deliveryMessage, setDeliveryMessage] = useState(null)
  const [sentEmail, setSentEmail] = useState('')
  const token = useRef('')
  const turnstileBox = useRef(null)
  const turnstileWidget = useRef(null)
  const turnstileToken = useRef('')

  // One-time signed token from the mailer; submissions without it are rejected.
  const fetchToken = useCallback(async ({ waitForMinimum = false } = {}) => {
    try {
      const url = `${CONTACT_ENDPOINT}${CONTACT_ENDPOINT.includes('?') ? '&' : '?'}action=token`
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) return
      const data = await response.json()
      token.current = data.token || ''
      // The server ignores forms sent within seconds of getting a token (bots do that)
      if (waitForMinimum) await new Promise((resolve) => setTimeout(resolve, MIN_FILL_MS))
    } catch {
      // A custom (non-PHP) endpoint may not issue tokens; submit without one
    }
  }, [])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  // Optional Turnstile widget: loads only when a site key is configured
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileBox.current) return undefined
    let cancelled = false
    const render = () => {
      if (cancelled || !window.turnstile || turnstileWidget.current !== null) return
      turnstileWidget.current = window.turnstile.render(turnstileBox.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        size: 'flexible',
        appearance: 'interaction-only', // invisible unless Cloudflare needs the visitor to click
        callback: (value) => { turnstileToken.current = value },
        'expired-callback': () => { turnstileToken.current = '' },
        'error-callback': () => { turnstileToken.current = '' },
      })
    }
    if (window.turnstile) {
      render()
    } else {
      let script = document.querySelector('script[data-turnstile]')
      if (!script) {
        script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.defer = true
        script.dataset.turnstile = ''
        document.head.appendChild(script)
      }
      script.addEventListener('load', render)
    }
    return () => { cancelled = true }
  }, [])

  const resetTurnstile = () => {
    if (window.turnstile && turnstileWidget.current !== null) {
      window.turnstile.reset(turnstileWidget.current)
      turnstileToken.current = ''
    }
  }

  const postEnquiry = async (payload) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, token: token.current, turnstileToken: turnstileToken.current }),
        signal: controller.signal,
      })
      let data = {}
      try { data = await response.json() } catch { /* empty or non-JSON body */ }
      return { ok: response.ok && data.ok !== false, status: response.status, error: data.error || '', detail: data.detail || '' }
    } finally {
      clearTimeout(timeout)
    }
  }
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    // Errors appear only after the visitor presses Send, then update live as fields are fixed
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
    fullName: '', company: '', email: '', phone: '', service: '', message: '', website: '',
  } })

  useEffect(() => {
    const preselect = (event) => {
      const requested = event.detail
      const matching = services.find((service) =>
        service === requested || (typeof requested === 'string' && slugify(service) === requested),
      )
      if (matching) setValue('service', matching)
    }
    window.addEventListener('teecoms:select-service', preselect)
    return () => window.removeEventListener('teecoms:select-service', preselect)
  }, [services, setValue])

  const options = services.map((service) => ({ label: service, value: service }))

  const onSubmit = async (values) => {
    setDeliveryMessage(null)
    // Honeypot: silently refuse to pass suspicious submissions to the backend.
    if (values.website?.trim()) {
      setDeliveryMessage({ kind: 'error', text: content.submitError })
      return
    }

    const { website: _honeypot, ...enquiry } = values
    if (CONTACT_ENDPOINT) {
      if (TURNSTILE_SITE_KEY && !turnstileToken.current) {
        setDeliveryMessage({ kind: 'info', text: content.verifyingMessage || MESSAGES.verifying })
        return
      }
      const payload = { ...enquiry, website: values.website || '' }
      try {
        let result = await postEnquiry(payload)
        if (result.status === 400 && result.error.startsWith('token')) {
          // Token missing or expired (e.g. the page was left open for hours): get a fresh one, retry once
          await fetchToken({ waitForMinimum: true })
          result = await postEnquiry(payload)
        }
        if (result.ok) {
          setSentEmail(values.email)
          return
        }
        if (result.error === 'captcha') {
          resetTurnstile()
          setDeliveryMessage({ kind: 'error', text: content.verifyError || MESSAGES.verify })
          return
        }
        if (result.status === 429) {
          setDeliveryMessage({ kind: 'error', text: content.rateLimitMessage || MESSAGES.rateLimited })
          return
        }
        // The error code (e.g. send_failed, not_configured, smtp_host_invalid) tells you where it failed;
        // detail is included for setup mistakes, and for mail-server errors when CONTACT_DEBUG=true
        console.warn(`[contact] Server replied ${result.status}${result.error ? `: ${result.error}` : ''}`)
        if (result.detail) console.error('[contact]', result.detail)
        if (process.env.NODE_ENV === 'development' && [404, 405, 500, 502, 504].includes(result.status)) {
          console.warn(
            `[contact] ${CONTACT_ENDPOINT} returned ${result.status}${result.error ? ` (${result.error})` : ''}. `
            + 'In development the PHP mailer must be running: start it with `npm run dev:php` in a second terminal '
            + '(needs PHP 8.1+), and set the SMTP_* and CONTACT_* values in .env or .env.local. See docs/BUILD-GUIDE.md.',
          )
        }
        throw new Error(`Contact endpoint returned ${result.status}`)
      } catch {
        setDeliveryMessage({ kind: 'error', text: content.submitError })
      }
      return
    }

    if (site.contact.email) {
      const subject = `Teecoms enquiry: ${values.service || 'General enquiry'}`
      const body = [
        `Full name: ${values.fullName}`,
        `Company: ${values.company || 'Not specified'}`,
        `Email: ${values.email}`,
        `Phone: ${values.phone || 'Not specified'}`,
        `Service: ${values.service || 'Not specified'}`,
        '',
        values.message,
      ].join('\n')
      window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setDeliveryMessage({ kind: 'info', text: content.emailDraftMessage })
      return
    }

    setDeliveryMessage({ kind: 'error', text: content.unavailableMessage })
  }

  if (sentEmail) {
    return (
      <div className={styles.card} role="status" aria-live="polite">
        <div className={styles.success}>
          <CheckCircle2 size={40} aria-hidden="true" />
          <h3>{content.successTitle}</h3>
          <p>{content.successPrefix} <strong>{sentEmail}</strong>.</p>
        </div>
      </div>
    )
  }

  return (
    <form className={styles.card} noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name">{content.labels.name} <span className="sr-only">(required)</span></label>
          <input id="contact-name" autoComplete="name" placeholder={content.placeholders.name}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'contact-name-error' : undefined}
            {...register('fullName', {
              required: content.errors.nameRequired,
              validate: (value) => value.trim().length >= 2 || content.errors.nameShort,
            })} />
          {fieldError(errors.fullName, 'contact-name-error', styles)}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-company">{content.labels.company}</label>
          <input id="contact-company" autoComplete="organization" placeholder={content.placeholders.company}
            {...register('company')} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-email">{content.labels.email} <span className="sr-only">(required)</span></label>
          <input id="contact-email" type="email" autoComplete="email" inputMode="email"
            placeholder={content.placeholders.email} aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            {...register('email', {
              required: content.errors.emailRequired,
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: content.errors.emailInvalid },
            })} />
          {fieldError(errors.email, 'contact-email-error', styles)}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-phone">{content.labels.phone}</label>
          <input id="contact-phone" type="tel" autoComplete="tel" inputMode="tel"
            placeholder={content.placeholders.phone} aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            {...register('phone', {
              validate: (value) => !value.trim() || /^(?:\+234|234|0)\d{10}$/.test(value.replace(/[\s().-]/g, '')) || content.errors.phoneInvalid,
            })} />
          {fieldError(errors.phone, 'contact-phone-error', styles)}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-service">{content.labels.service}</label>
        <div className={styles.selectWrap}>
          <Controller
            name="service"
            control={control}
            render={({ field }) => (
              <Select
                instanceId="contact-service"
                inputId="contact-service"
                name={field.name}
                ref={field.ref}
                className={styles.serviceSelect}
                classNamePrefix="service-select"
                options={options}
                value={options.find((option) => option.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value || '')}
                onBlur={field.onBlur}
                placeholder={content.placeholders.service}
                isClearable
                components={{ IndicatorSeparator: null }}
                isSearchable
                unstyled
                maxMenuHeight={280}
                menuPlacement="auto"
                noOptionsMessage={() => 'No matching services'}
                aria-label={content.labels.service}
              />
            )}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">{content.labels.message} <span className="sr-only">(required)</span></label>
        <textarea id="contact-message" rows={4} placeholder={content.placeholders.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          {...register('message', {
            required: content.errors.messageRequired,
            validate: (value) => value.trim().length >= 20 || content.errors.messageShort,
          })} />
        {fieldError(errors.message, 'contact-message-error', styles)}
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">Leave this field blank</label>
        <input id="contact-website" type="text" autoComplete="off" tabIndex={-1} {...register('website')} />
      </div>

      {deliveryMessage && (
        <p className={styles.notice} data-kind={deliveryMessage.kind}
          role={deliveryMessage.kind === 'error' ? 'alert' : 'status'}>{deliveryMessage.text}</p>
      )}
      {TURNSTILE_SITE_KEY ? <div ref={turnstileBox} className={styles.turnstile} /> : null}
      <Button type="submit" variant="primary" arrow={false} disabled={isSubmitting}
        aria-disabled={isSubmitting} aria-busy={isSubmitting} className={styles.submit}>
        <span className={styles.submitLabel}>
          {isSubmitting ? content.sending : content.submit}
          {!isSubmitting && <Send size={16} aria-hidden="true" />}
        </span>
      </Button>
    </form>
  )
}
