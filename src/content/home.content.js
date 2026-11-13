// Approved homepage copy. Edit wording here, not inside components.

export const heroSlides = [
  {
    id: 'teecoms',
    tab: 'Teecoms',
    visual: 'network',
    eyebrow: 'Welcome to Teecoms',
    title: 'Powering a More Connected Digital Future',
    description:
      'At Teecoms, we help organisations connect, innovate and grow through reliable ICT infrastructure, telecommunications and digital transformation solutions. We combine technical expertise with a commitment to security, efficiency and long-term business value.',
    primary: { label: 'Explore Our Solutions', href: '#services' },
    secondary: { label: 'Discover Teecoms', href: '#about' },
  },
  {
    id: 'infrastructure',
    tab: 'Infrastructure',
    visual: 'infrastructure',
    eyebrow: 'Built for Performance',
    title: 'Stronger Infrastructure. Smarter Operations.',
    description:
      'A dependable digital foundation is essential to every modern organisation. From ICT infrastructure and communication networks to cloud and hosting services, Teecoms delivers solutions designed to improve connectivity, support business continuity and strengthen operational performance.',
    primary: { label: 'Our Services', href: '#services' },
    secondary: { label: 'Talk to an Expert', href: '#contact' },
  },
  {
    id: 'transformation',
    tab: 'Transformation',
    visual: 'transformation',
    eyebrow: 'Technology That Works for You',
    title: 'Transform the Way You Work, Connect and Grow.',
    description:
      'Technology should make business easier, not more complicated. We help organisations modernise their operations through tailored software solutions, managed IT services, cybersecurity and strategic digital advisory.',
    primary: { label: 'Discover Our Expertise', href: '#services' },
    secondary: { label: 'Request a Consultation', href: '#contact' },
  },
  {
    id: 'digitalinvoice',
    tab: 'DigitalInvoice',
    visual: 'digitalinvoice',
    accent: 'di',
    eyebrow: 'Innovation from Teecoms',
    title: 'Smarter Invoicing. Simpler Business.',
    description:
      'Meet DigitalInvoice, our flagship digital invoicing solution developed to make billing more efficient, organised and accessible. Designed for modern businesses, DigitalInvoice brings invoice management, transaction visibility and digital workflows together for a simpler invoicing experience.',
    primary: { label: 'Explore DigitalInvoice', href: '#digitalinvoice' },
    secondary: { label: 'Request a Demo', href: '#contact' },
  },
]

export const aboutContent = {
  eyebrow: 'Who We Are',
  title: 'Technology Solutions Built Around Your Business.',
  lead:
    'Teecoms Integrated Solutions Limited is a Nigerian information and communications technology company providing innovative, secure and cost-effective technology and telecommunications solutions to public and private sector organisations.',
  paragraphs: [
    'Our expertise spans ICT infrastructure, cloud and hosting, cybersecurity, software and application services, managed IT operations, digital transformation and technology consultancy.',
    'We understand that organisations need more than technology. They need dependable systems, practical expertise and solutions that respond to evolving business needs.',
    'At Teecoms, we bring together technology, people and processes to help organisations enhance efficiency, strengthen security and create lasting value.',
  ],
  // Pillars layout: technology, people and processes (from the closing paragraph)
  pillars: [
    {
      icon: 'Cpu',
      title: 'Technology',
      body: 'ICT infrastructure, cloud and hosting, cybersecurity, and software and application services.',
    },
    {
      icon: 'Users',
      title: 'People',
      body: 'Practical expertise and dependable systems that respond to evolving business needs.',
    },
    {
      icon: 'Settings2',
      title: 'Processes',
      body: 'Managed IT operations, digital transformation and technology consultancy.',
    },
  ],
  closing: {
    strong: 'At Teecoms, we bring together technology, people and processes',
    rest: ' to help organisations enhance efficiency, strengthen security and create lasting value.',
  },
  cta: { label: 'Discover Our Expertise', href: '#services' },
  expertiseLabel: 'Our expertise',
  // icon names are lucide-react exports
  expertise: [
    { icon: 'Server', label: 'ICT infrastructure' },
    { icon: 'Cloud', label: 'Cloud & hosting' },
    { icon: 'ShieldCheck', label: 'Cybersecurity' },
    { icon: 'Code2', label: 'Software & applications' },
    { icon: 'MonitorCog', label: 'Managed IT operations' },
    { icon: 'Workflow', label: 'Digital transformation' },
    { icon: 'Compass', label: 'Technology consultancy' },
  ],
  sector: { title: 'Public & private sector', note: 'Organisations across Nigeria' },
  mission: {
    label: 'Our Mission',
    title: 'Making Digital Connectivity and Innovation Accessible.',
    body:
      "To expand Nigeria's digital capacity by delivering resilient, affordable and high-quality technology and telecommunications services. We are committed to bridging connectivity gaps, supporting digital transformation and empowering organisations with practical, reliable solutions.",
  },
  vision: {
    label: 'Our Vision',
    title: 'Building a Smarter, More Connected Tomorrow.',
    body:
      'To become a trusted leader in innovative, secure and high-quality ICT and telecommunications solutions, enabling a digitally connected society and supporting sustainable socio-economic development across Nigeria and beyond.',
  },
}

export const servicesContent = {
  eyebrow: 'What We Do',
  title: 'Comprehensive Technology Solutions for a Digital World.',
  intro:
    'From building reliable technology infrastructure to developing intelligent software solutions, Teecoms offers services that help organisations operate efficiently, protect their digital assets and adapt to technological change.',
  // Numbered as in the approved copy. icon names are lucide-react exports.
  items: [
    {
      icon: 'Server',
      title: 'IT Infrastructure Services',
      tagline: 'Building the Foundation for Reliable Connectivity.',
      body: 'We provide ICT infrastructure solutions designed to support communication, connectivity and business operations. Our approach focuses on creating dependable technology environments that can accommodate current needs and future growth.',
    },
    {
      icon: 'Cloud',
      title: 'Cloud & Hosting Services',
      tagline: 'Flexible Infrastructure for Modern Business.',
      body: 'Give your organisation the flexibility to operate in a connected environment. Our cloud and hosting services support business applications, data accessibility and the efficient management of digital resources.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Cybersecurity & Compliance Services',
      tagline: 'Protecting What Matters Most.',
      body: 'Security is essential to digital growth. We help organisations strengthen information security, manage technology risks and support compliance with applicable data protection and regulatory requirements.',
    },
    {
      icon: 'MonitorCog',
      title: 'Managed ICT Services',
      tagline: 'Your Technology. Expertly Supported.',
      body: 'Focus on running your business while we help manage your technology environment. Our managed ICT services are designed to support the maintenance, monitoring and operational reliability of essential systems.',
    },
    {
      icon: 'Code2',
      title: 'Software & Application Services',
      tagline: 'Digital Solutions Designed Around Your Needs.',
      body: 'Every organisation has unique challenges. We provide software and application services that support process improvement, workflow automation and efficient digital operations.',
    },
    {
      icon: 'Workflow',
      title: 'Digital Transformation & Advisory',
      tagline: 'Turning Technology into Business Advantage.',
      body: 'Digital transformation begins with the right strategy. We help organisations evaluate their technology needs, identify opportunities for improvement and develop practical approaches to digital modernisation.',
    },
    {
      icon: 'GraduationCap',
      title: 'Training & Capacity Building',
      tagline: 'Empowering People Through Technology.',
      body: 'Successful digital transformation depends on people as much as systems. Our training and capacity-building services help individuals and teams strengthen their digital capabilities and improve technology adoption.',
    },
    {
      icon: 'Presentation',
      title: 'Corporate Digital Transformation Workshops',
      tagline: "Helping Organisations Prepare for What's Next.",
      body: 'Our corporate workshops help teams explore emerging technologies, understand digital opportunities and develop practical ideas for improving business performance through technology.',
    },
  ],
  cta: { label: "Let's Build Your Next Solution", href: '#contact' },
}

export const digitalInvoiceContent = {
  eyebrow: 'Innovation by Teecoms',
  title: 'Introducing DigitalInvoice',
  subtitle: 'Simplifying Invoicing. Supporting Business Growth.',
  paragraphs: [
    'DigitalInvoice is a flagship digital invoicing and billing solution from Teecoms, designed to help businesses streamline invoice management and improve the efficiency of their financial workflows.',
    'By bringing essential billing activities into a structured digital environment, DigitalInvoice aims to reduce manual processes, improve transaction visibility and make everyday invoicing more convenient.',
    'Whether managing routine invoices or organising business billing information, DigitalInvoice provides a technology-driven approach to simpler financial administration.',
  ],
  primary: { label: 'Explore DigitalInvoice' }, // external website from NEXT_PUBLIC_DIGITALINVOICE_URL
  secondary: { label: 'Request a Product Demo', href: '#contact' }, // demo URL takes precedence when configured
  socialTitle: 'Follow Us',
  devicesLabel: 'The DigitalInvoice dashboard on a laptop, showing invoices and collections, and an approved invoice on a phone',
  toast: { title: 'Payment recorded', note: '₦1,236,250.00 received for INV-0420' },
  featuresTitle: 'What DigitalInvoice Brings to Your Business',
  features: [
    {
      icon: 'FileText',
      title: 'Streamlined Digital Invoicing',
      body: 'Create, organise and manage business invoices through a more efficient digital workflow.',
    },
    {
      icon: 'Receipt',
      title: 'More Organised Billing Records',
      body: 'Reduce dependence on scattered manual records and maintain clearer visibility over invoicing activities.',
    },
    {
      icon: 'Eye',
      title: 'Transaction Visibility',
      body: 'Keep track of invoice information and associated transaction activity to support better business administration.',
    },
    {
      icon: 'BarChart3',
      title: 'Business Reporting',
      body: 'Access billing information and reporting insights that support financial oversight and informed decisions.',
    },
  ],
  // Reference expansion: product-specific detail not covered by Teecoms' corporate Services cards.
  // Regulatory approvals, NRS integration, third-party integrations and performance
  // numbers in the supplied reference artwork are not independently confirmed.
  compliance: {
    eyebrow: 'Nigeria’s E-Invoicing Landscape',
    title: 'Preparing for Nigeria’s E-Invoicing Future.',
    body:
      'As invoicing requirements and reporting processes evolve, a structured approach to invoice data, reviews and records can help organisations prepare for change.',
    items: [
      {
        icon: 'FileCheck2',
        title: 'Invoice Data & Documentation',
        body: 'Bring key billing details and supporting records into a more organised digital workflow.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Governance & Review',
        body: 'Consider approval controls, accountability and data-handling practices when modernising billing.',
      },
      {
        icon: 'ArrowLeftRight',
        title: 'Regulatory Readiness',
        body: 'Discuss current Nigerian e-invoicing obligations and any required reporting connections before rollout.',
      },
    ],
    note:
      'Regulatory approvals, NRS connections and submission capabilities must be confirmed with Teecoms for your specific use case.',
  },
  integrations: {
    eyebrow: 'Your Existing Technology',
    title: 'Start With the Systems You Already Use.',
    body:
      'Whether your team works with accounting software, an ERP platform or an internal application, Teecoms can review the integration requirements for your invoicing workflow.',
    systems: ['Sage', 'QuickBooks', 'Microsoft Dynamics', 'Oracle', 'Odoo', 'Custom APIs'],
    note:
      'Platforms shown are examples for compatibility assessment, not confirmed integrations or vendor partnerships.',
  },
  industries: {
    eyebrow: 'Industry Use Cases',
    title: 'Different Sectors. Different Billing Needs.',
    body:
      'Explore where a more structured digital invoicing process may support everyday billing and record-keeping.',
    items: [
      { icon: 'Landmark', title: 'Financial Services', body: 'Client billing records' },
      { icon: 'Factory', title: 'Manufacturing', body: 'Supplier and distributor invoices' },
      { icon: 'Fuel', title: 'Oil & Gas', body: 'Contract and vendor billing' },
      { icon: 'HeartPulse', title: 'Healthcare', body: 'Service and supplier billing' },
      { icon: 'ShoppingCart', title: 'Retail & FMCG', body: 'Sales and transaction records' },
      { icon: 'Building2', title: 'Government & Parastatals', body: 'Procurement documentation' },
      { icon: 'GraduationCap', title: 'Education', body: 'Fees and service invoices' },
      { icon: 'BriefcaseBusiness', title: 'Professional Services', body: 'Project and retainer billing' },
    ],
  },
  closing: {
    title: 'Built for Businesses Ready to Work Smarter.',
    body: "DigitalInvoice reflects Teecoms' commitment to developing practical technology products that address everyday business challenges.",
  },
}

export const whyContent = {
  eyebrow: 'The Teecoms Advantage',
  title: 'Technology Expertise. Trusted Relationships. Lasting Value.',
  lead:
    'We believe the best technology solutions are built on a clear understanding of the people and organisations they serve.',
  body:
    'Our approach combines technical capability, responsible service delivery and a commitment to helping clients make better use of technology.',
  // In the same reading order and with the same icons as the approved design.
  values: [
    {
      icon: 'Lightbulb',
      title: 'Innovation',
      body: 'We embrace modern technologies and forward-thinking ideas to develop solutions that improve efficiency, performance and long-term value.',
    },
    {
      icon: 'BadgeCheck',
      title: 'Reliability',
      body: 'We prioritise dependable services and resilient systems that organisations can rely on for their daily operations.',
    },
    {
      icon: 'Users',
      title: 'Customer-Centricity',
      body: "We listen, understand and respond to each client's requirements, with solutions shaped around their operational needs and business objectives.",
    },
    {
      icon: 'Scale',
      title: 'Integrity',
      body: 'We value honesty, accountability and transparency in our partnerships, service delivery and business decisions.',
    },
    {
      icon: 'Award',
      title: 'Excellence',
      body: 'We pursue high standards through careful planning, quality controls and continuous improvement.',
    },
    {
      icon: 'Lock',
      title: 'Security & Compliance',
      body: 'We recognise the importance of protecting information and maintaining responsible practices aligned with relevant security and regulatory requirements.',
    },
    {
      icon: 'Handshake',
      title: 'Collaboration',
      body: 'We believe meaningful partnerships and teamwork are essential to delivering effective, sustainable technology solutions.',
    },
    {
      icon: 'Leaf',
      title: 'Sustainability',
      body: 'We support responsible resource use, environmentally conscious practices and technology solutions that contribute to long-term social and economic development.',
    },
  ],
}


export const teamContent = {
  eyebrow: 'The People Behind Teecoms',
  title: 'Driven by Expertise. United by Purpose.',
  intro:
    'Our management team brings together expertise in business leadership, technology, operations, financial administration and people management. Together, they guide our commitment to delivering reliable ICT solutions, maintaining sound corporate governance and building lasting client relationships.',
  // Portraits: 800×880 WebP in public/images/team/, matched to the company profile.
  members: [
    {
      name: 'Babalola Oluwatobi Samuel',
      image: '/images/team/babalola-oluwatobi-samuel.webp',
      initials: 'BS',
      role: 'Managing Director',
      body:
        "Provides overall strategic leadership, corporate direction and governance oversight, guiding business growth, stakeholder relations and the execution of the company's technology initiatives.",
    },
    {
      name: 'Azuka Adoh',
      image: '/images/team/azuka-adoh.webp',
      initials: 'AA',
      role: 'Chief Technical Officer',
      body:
        "Leads the company's technical direction across software development, systems engineering, network deployment, cybersecurity and ICT infrastructure.",
    },
    {
      name: 'Ayotunde Odusanya',
      image: '/images/team/ayotunde-odusanya.webp',
      initials: 'AO',
      role: 'Operations Manager',
      body:
        'Coordinates day-to-day operations, project execution, service delivery and operational processes to support efficient implementation of client solutions.',
    },
    {
      name: 'Tolulope Babalola',
      image: '/images/team/tolulope-babalola.webp',
      initials: 'TB',
      role: 'Finance & Administration Manager',
      body:
        'Oversees financial planning, reporting, budgeting, administration and internal controls to support responsible business operations.',
    },
    {
      name: 'Juliet Onyinyechi Ugochukwu',
      image: '/images/team/juliet-onyinyechi-ugochukwu.webp',
      initials: 'JU',
      role: 'Human Resources Manager',
      body:
        'Supports workforce development, employee relations, organisational administration and the people-focused initiatives that contribute to effective service delivery.',
    },
  ],
}

export const commitmentsContent = {
  eyebrow: 'Responsibility at Every Level',
  title: 'Built on Quality, Safety and Trust.',
  intro:
    'At Teecoms, responsible service delivery is central to the way we operate. Our corporate policies reflect our commitment to maintaining professional standards, protecting information and providing a safe environment for employees, clients and stakeholders.',
  items: [
    {
      icon: 'ClipboardCheck',
      title: 'Quality Assurance',
      tagline: 'Delivering with Care and Consistency.',
      body:
        'We apply quality control, documentation review and compliance checks as part of our commitment to consistent service delivery and project excellence.',
    },
    {
      icon: 'HardHat',
      title: 'Health, Safety & Environment',
      tagline: "Safety is Everyone's Responsibility.",
      body:
        'We promote safe working practices, preventive measures and environmental responsibility to help safeguard our people, clients and project environments.',
    },
    {
      icon: 'FileLock2',
      title: 'Data Protection & Regulatory Compliance',
      tagline: 'Protecting Information. Building Confidence.',
      body:
        'We are committed to the responsible handling of personal and corporate information, guided by applicable Nigerian data protection requirements and relevant industry regulations.',
    },
  ],
}


export const ctaContent = {
  eyebrow: "Let's Create Something Meaningful",
  title: 'Your Next Digital Opportunity Starts Here.',
  body:
    'Whether you are strengthening your ICT infrastructure, modernising business operations, improving cybersecurity or exploring new digital solutions, Teecoms is ready to discuss your technology needs.',
  followup:
    "Let's explore how the right solutions can help your organisation move forward.",
  primary: { label: 'Start a Conversation', href: '#contact' },
  secondary: { label: 'Explore Our Services', href: '#services' },
}

export const contactContent = {
  eyebrow: 'Get in Touch',
  title: "Let's Talk About Your Next Project.",
  intro:
    'Have a technology challenge, a business idea or a project in mind? Our team would be pleased to discuss your requirements and explore how Teecoms can support your organisation.',
  unconfirmed: 'To be confirmed',
  serviceOptions: [...servicesContent.items.map(({ title }) => title), 'DigitalInvoice', 'Other'],
  form: {
    labels: {
      name: 'Full name',
      company: 'Company / Organisation',
      email: 'Business email',
      phone: 'Phone number',
      service: 'Service of interest',
      message: 'Your message',
    },
    placeholders: {
      name: 'Adaeze Okafor',
      company: 'Your organisation',
      email: 'name@company.com',
      phone: '+234 800 000 0000',
      service: 'Select a service',
      message: 'Tell us about your project, timeline and goals',
    },
    errors: {
      nameRequired: 'Enter your full name.',
      nameShort: 'Enter at least two characters for your name.',
      emailRequired: 'Enter your business email address.',
      emailInvalid: 'Enter a valid email address, like name@company.com.',
      phoneInvalid: 'Enter a Nigerian phone number, like 0801 234 5678 or +234 801 234 5678.',
      messageRequired: 'Tell us about your project.',
      messageShort: 'Please provide at least 20 characters about your project.',
    },
    submit: 'Send Your Enquiry',
    sending: 'Sending…',
    successTitle: 'Enquiry sent.',
    successPrefix: 'Our team will contact you at',
    submitError: "Your enquiry wasn't sent. Check your connection and try again, or email us directly when our verified email address is available.",
    unavailableMessage: 'The enquiry form is not yet connected. Please try again once the company contact details or submission endpoint have been confirmed.',
    emailDraftMessage: 'An email draft should open in your email app. Please send it to complete your enquiry; it has not been submitted by the website.',
  },
}

export const footerContent = {
  quickLinksTitle: 'Quick links',
  quickLinks: [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Our Services', href: '#services' },
    { label: 'DigitalInvoice', href: '#digitalinvoice' },
    { label: 'Our Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
  ],
  servicesTitle: 'Our services',
  // Service cards are grouped in #services; each footer link jumps to that section.
  services: [
    { label: 'IT Infrastructure', href: '#services' },
    { label: 'Cloud & Hosting', href: '#services' },
    { label: 'Cybersecurity', href: '#services' },
    { label: 'Managed ICT', href: '#services' },
    { label: 'Software Solutions', href: '#services' },
    { label: 'Digital Transformation', href: '#services' },
  ],
  productTitle: 'Flagship product',
  productDescription: 'Digital invoicing and billing solutions by Teecoms.',
  productButton: 'Explore DigitalInvoice',
  socialTitle: 'Follow Us',
  rights: 'All rights reserved.',
  backToTop: 'Back to top',
}
