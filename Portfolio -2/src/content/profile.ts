export interface Profile {
  name: string;
  headline: string;
  location: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github?: string;
    twitter?: string;
    discord?: string;
    instagram?: string;
    website?: string;
  };
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  coursework?: string[];
}

export interface Project {
  name: string;
  year: string;
  description: string;
  tech: string[];
  highlights: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
}

export const profile: Profile = {
  name: "Naveen Ajay Karasu",
  headline: "Software Engineer | Security & Cloud",
  location: "Hyattsville, MD",
  contact: {
    email: "naveenajaykarasu+intern@my.unt.edu",
    phone: "(940) 331-2733",
    linkedin: "https://linkedin.com/in/naveenkarasu",
    github: "https://github.com/naveenkarasu",
  },
  summary: `Software Engineer specializing in Security and Cloud with 6+ years of experience building secure backend services, cloud-native microservices, and high-reliability distributed systems. Adept at applying secure SDLC, DevSecOps, CI/CD automation, Java/Spring, Node.js, Kubernetes, and AWS to deliver resilient, scalable, and compliant platforms. Skilled in SAST/SCA/DAST, CVE remediation, container security, threat mitigation, observability engineering, and cross-team collaboration.`,

  skills: [
    {
      category: "Languages & Frameworks",
      items: ["Java (Spring Boot, Hibernate)", "JavaScript", "TypeScript", "Python (TensorFlow, PyTorch)", "C#", "Node.js", "React", "Angular", "Nest.js", "Go", "Rust"]
    },
    {
      category: "Frontend",
      items: ["HTML", "CSS", "Bootstrap", "React", "Angular", "Flutter"]
    },
    {
      category: "Backend & APIs",
      items: ["RESTful APIs", "GraphQL", "SOAP", "Microservices", "Event-driven Design", "API Versioning", "Swagger APIs", "Modular Architecture"]
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "MongoDB", "MySQL", "DynamoDB", "Cosmos DB", "SQL Server", "Redis", "Couchbase", "DB2"]
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS", "Azure", "Docker", "Kubernetes", "OpenShift", "Digital Ocean", "Jenkins", "GitHub Actions", "Git", "Bitbucket", "OpenTelemetry", "Splunk", "CI/CD", "ServiceNow"]
    },
    {
      category: "Security & Testing",
      items: ["Checkmarx", "SonarQube", "Nexus IQ", "Qualys VM", "AWS Inspector", "OWASP Top 10", "SDLC Security", "IAM Hardening", "JUnit", "Mockito", "Selenium", "Cucumber", "Postman"]
    },
    {
      category: "AI/ML & Data",
      items: ["LLM integration (OpenAI GPT-4)", "Python ML pipelines", "Kafka", "Distributed Streaming", "Data Modeling", "Airflow", "Real-Time Analytics"]
    }
  ],

  experience: [
    {
      title: "Software Engineer & Cybersecurity Specialist",
      company: "Community Dreams Foundation",
      location: "Frederick, MD",
      period: "Apr 2025 – Present",
      bullets: [
        "Designed and deployed secure Node.js + React microservices on AWS EKS/ECS using IAM least-privilege, container hardening, and encrypted secrets, improving operational reliability by 35%",
        "Integrated Checkmarx, SonarQube, and Sonatype Nexus IQ into CI/CD pipelines, remediating 100% of high-severity CVEs and enforcing automated security gates",
        "Built DevSecOps workflows using GitHub Actions, Docker scanning, and secret rotation patterns, reducing manual release effort by 60%",
        "Implemented Prometheus metrics and Splunk dashboards for full-stack observability, improving incident triage efficiency by 40%",
        "Mentored junior developers on secure coding, test automation, and cloud infrastructure best practices"
      ]
    },
    {
      title: "AI Security Research Intern",
      company: "Cyber Future Foundation",
      location: "Denton, TX",
      period: "May 2024 – Jul 2024",
      bullets: [
        "Built Python-based automation pipelines for NIST/ISO/HIPAA control validation, reducing compliance audit preparation time by 40%",
        "Designed secure ML pipeline workflows integrating identity controls, encrypted artifact storage, and automated audit logging",
        "Developed Google API integrations to automatically track, validate, and archive compliance artifacts",
        "Documented security patterns, SDLC controls, and pipeline hardening recommendations"
      ]
    },
    {
      title: "Software Engineer",
      company: "University of North Texas",
      location: "Denton, TX",
      period: "May 2023 – Dec 2024",
      bullets: [
        "Developed secure Kubernetes and Docker training platforms, incorporating workload isolation, image scanning, and least-privilege RBAC",
        "Led backend engineering workshops covering secure API design and authentication flows for 120+ students",
        "Created DevOps lab pipelines using GitHub Actions, Docker, and IaC concepts, demonstrating secure CI/CD workflows"
      ]
    },
    {
      title: "Research Assistant",
      company: "University of North Texas",
      location: "Denton, TX",
      period: "Jan 2023 – May 2023",
      bullets: [
        "Refactored core C# components of a threat-modeling system, improving JSON deserialization performance by 25%",
        "Reviewed architectural design proposals with Microsoft engineers to verify compliance with secure coding principles",
        "Built automated unit/integration tests to increase coverage across critical modules"
      ]
    },
    {
      title: "Software Engineer",
      company: "Tata Consultancy Services (TCS)",
      location: "Kochi, India",
      period: "Feb 2021 – Jan 2023",
      bullets: [
        "Designed secure Spring Boot microservices for financial clients using MongoDB, Kafka, and Azure, reducing API error rates by 30%",
        "Integrated Checkmarx, SonarQube, and Nexus IQ into Jenkins pipelines, establishing automated SCA/SAST governance",
        "Migrated legacy modules to event-driven microservices with secure auth flows and input validation",
        "Implemented containerized deployments on AWS/Azure with automated vulnerability scanning and RBAC governance"
      ]
    },
    {
      title: "Software Engineer",
      company: "MAQ Software",
      location: "Hyderabad, India",
      period: "Aug 2019 – Jan 2021",
      bullets: [
        "Built and optimized secure Spring Boot batch workflows, increasing data throughput",
        "Automated Azure DevOps analytics pipelines with audit logging, improving transparency",
        "Designed Power BI dashboards summarizing sprint health and performance KPIs",
        "Improved service reliability by tuning database queries and optimizing caching strategies"
      ]
    }
  ],

  education: [
    {
      degree: "Master of Science, Cybersecurity",
      institution: "University of North Texas",
      location: "Denton, TX",
      period: "Jan 2023 – Dec 2024",
      coursework: ["Secure Software Development", "Network Security", "Computer Security", "Wireless Networks", "Computer Forensics"]
    },
    {
      degree: "Bachelor of Technology, Computer Science",
      institution: "Keshav Memorial Institute of Technology",
      location: "Hyderabad, India",
      period: "Jul 2016 – May 2020",
      coursework: ["Data Structures and Algorithms", "Operating Systems", "Software Engineering", "Database Organization", "Cryptography"]
    }
  ],

  projects: [
    {
      name: "Smart Incident Response Engine",
      year: "2024",
      description: "Automated SIEM log parsing system with real-time threat detection and remediation",
      tech: ["Python", "Kafka", "Splunk", "ElasticSearch"],
      highlights: [
        "Built Python + Kafka automation pipelines to parse SIEM events and trigger remediation actions",
        "Reduced incident response time by 60% and false positives by 35%",
        "Integrated Splunk dashboards and structured logging for improved triage visibility"
      ]
    },
    {
      name: "Order Processing Platform",
      year: "2023",
      description: "Event-driven microservices platform for asynchronous order lifecycle management",
      tech: ["Spring Boot", "Kafka", "MongoDB", "Redis", "AWS EKS", "Prometheus", "Grafana"],
      highlights: [
        "Achieved 99.9% uptime under simulated load with OpenTelemetry tracing",
        "Deployed workloads to AWS EKS with container scanning and IAM hardening",
        "Implemented distributed tracing and performance tuning"
      ]
    },
    {
      name: "Distributed LLM Training Pipeline",
      year: "2024",
      description: "PySpark-based distributed training system for transformer models",
      tech: ["PySpark", "Docker", "DistilBERT", "Python"],
      highlights: [
        "Reduced epoch time by 45% through distributed cluster optimization",
        "Implemented encrypted dataset handling and strict access controls",
        "Tuned storage throughput and memory allocation for optimal resource usage"
      ]
    },
    {
      name: "Weather Data Aggregator API",
      year: "2024",
      description: "Real-time and historical weather data collection and serving API",
      tech: ["Node.js", "MongoDB", "Docker", "Prometheus"],
      highlights: [
        "Built scheduled ingestion pipelines for weather data collection",
        "Designed indexing and caching strategies for optimized query performance",
        "Added Docker-based observability with Prometheus metrics"
      ]
    },
    {
      name: "Secure Payments Gateway",
      year: "2024",
      description: "PCI-aware payments backend with tokenization and fraud prevention",
      tech: ["Node.js", "PostgreSQL", "AWS ECS"],
      highlights: [
        "Designed tokenization patterns for secure digital transaction processing",
        "Built microservices with automated vulnerability scanning and secret management",
        "Implemented validation rules and monitoring dashboards to reduce fraud risk"
      ]
    },
    {
      name: "Network Anomaly Detection System",
      year: "2022",
      description: "Python microservices for VPN/proxy detection and malicious URL classification",
      tech: ["Python", "Kafka", "NLP", "Machine Learning"],
      highlights: [
        "Achieved 95% accuracy in malicious URL classification using NLP",
        "Built web dashboard with Kafka streaming for IP log ingest"
      ]
    }
  ],

  certifications: [
    { name: "Certified Ethical Hacker (CEH)", issuer: "EC-Council" },
    { name: "Certified in Cybersecurity (CC)", issuer: "ISC2" },
    { name: "DevOps Training", issuer: "Microsoft" },
    { name: "Second Place — CanSec24 CTF", issuer: "CanSec Conference" },
    { name: "Distinguished Student of the Year", issuer: "2025" }
  ]
};
