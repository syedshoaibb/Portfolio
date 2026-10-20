/*==========================================================
    PORTFOLIO
    FILE: portfolio-data.js
    The content for the Projects and Certificates sections.

    This is a plain script, not a JSON file, on purpose: browsers
    refuse to fetch() local files, so reading JSON broke the page
    whenever index.html was opened straight from a folder. A script
    tag works everywhere (folder or any web server).

    Edit the lists below. Keep the commas between items and keep
    the quotes around text. The README explains every field.
==========================================================*/

window.SMS = window.SMS || {};

SMS.data = {

    projects: [
        {
            "id": 1,
            "slug": "email-forensics",
            "title": "AI-Powered Email Threat Detection & Forensic Intelligence Platform",
            "short": "Email Forensics Module",
            "category": "Cybersecurity",
            "status": "Prototype",
            "featured": true,
            "spotlight": true,
            "context": "Smart India Hackathon 2026",
            "problemStatement": "SIH26106 · Blockchain & Cybersecurity",
            "team": "6-member team",
            "role": "Built the email forensics module and integrated the team's modules into the working demo.",
            "summary": "Flags phishing emails and shows investigators the technical evidence behind each verdict.",
            "description": "A prototype that spots phishing emails and gives investigators the technical evidence behind each verdict. I built the forensics module: it reads an uploaded .eml file and turns its headers, links and attachments into a clear report.",
            "evidence": [
                {
                    "label": "Sender identity",
                    "text": "Compares the From address with Reply-To and flags mismatches."
                },
                {
                    "label": "Email authentication",
                    "text": "Reads the SPF, DKIM and DMARC results recorded in the headers."
                },
                {
                    "label": "Embedded evidence",
                    "text": "Extracts URLs and attachments so they can be inspected."
                },
                {
                    "label": "Delivery path",
                    "text": "Lists server hops and routing details from the headers."
                }
            ],
            "overview": "Phishing emails are easy to send and hard to explain. This prototype, built for Smart India Hackathon 2026, flags suspicious emails and shows investigators the technical evidence behind each verdict. I built the forensics module and joined the team's modules into one working demo.",
            "workflow": [
                { "label": "Upload", "text": "An investigator uploads a .eml file." },
                { "label": "Parse", "text": "Python's email library extracts the headers, links and attachments." },
                { "label": "Detect", "text": "The team's detection models assess whether the message is phishing." },
                { "label": "Report", "text": "A forensic report is built from the parsed email itself, with no hardcoded values." }
            ],
            "highlights": [
                "Parsed uploaded .eml files with Python's email library to extract sender, receiver, Reply-To, Return-Path, Message-ID, SPF/DKIM/DMARC results, routing hops, URLs and attachments.",
                "Built each forensic report from the parsed email itself, with no static or hardcoded values.",
                "Integrated the detection, forensic and reporting modules into one end-to-end demo under hackathon time pressure, working with teammates who handled AI threat detection and model training."
            ],
            "technologies": [
                "Python",
                "FastAPI",
                "React.js",
                "XGBoost",
                "DistilRoBERTa",
                "SPF / DKIM / DMARC"
            ],
            "github": "https://github.com/syedshoaibb/email-detector",
            "live": "https://email-detector-wcy4.onrender.com",
            "liveLabel": "Try the prototype",
            "note": "The prototype runs on a free host, so the first load after a quiet period can take a little while.",
            "image": "assets/images/projects/email-forensics.svg",
            "imageAlt": "Illustration of an email forensics report with a Reply-To mismatch, SPF, DKIM and DMARC results, and the server hops a message took"
        },
        {
            "id": 2,
            "slug": "qr-menu",
            "title": "QR-Based Restaurant Ordering Platform",
            "short": "QR Menu",
            "category": "Web Application",
            "status": "Completed",
            "featured": true,
            "context": "Personal project",
            "team": "Solo",
            "role": "Designed and built the whole platform, using AI-assisted development.",
            "summary": "Scan a QR code, browse the live menu, order and track the status in real time.",
            "description": "Customers scan a QR code, browse the live menu, place an order and follow its status in real time. Owners and customers each get their own dashboard.",
            "overview": "A web platform for restaurants. Customers scan a QR code to browse the menu and order, while owners manage the menu and incoming orders from their own dashboard.",
            "workflow": [
                { "label": "Scan", "text": "A customer scans the QR code and opens the live menu." },
                { "label": "Order", "text": "They pick items and place the order." },
                { "label": "Sync", "text": "Firestore listeners update order status for owner and customer without a refresh." },
                { "label": "Manage", "text": "Owners sign in with Firebase Authentication; security rules block everyone else from writing." }
            ],
            "highlights": [
                "Stores the live menu in Cloud Firestore, so changes show up for customers straight away.",
                "Synchronises order status with Cloud Firestore listeners, so owners and customers see updates without refreshing.",
                "Uses Firebase Authentication and Firestore security rules to limit writes to authenticated owners while keeping the menu readable for customers."
            ],
            "technologies": [
                "HTML",
                "CSS",
                "JavaScript",
                "Firebase Authentication",
                "Cloud Firestore",
                "Netlify"
            ],
            "github": "https://github.com/syedshoaibb/QR-Menu",
            "live": "https://digitalmenuss.netlify.app/",
            "liveLabel": "Live demo",
            "image": "assets/images/projects/qr-menu.svg",
            "imageAlt": "Illustration of a QR code beside a phone showing a restaurant menu"
        },
        {
            "id": 3,
            "slug": "stegcrypto",
            "title": "StegCrypto: Hybrid Cryptography & Steganography System",
            "short": "StegCrypto",
            "category": "Security",
            "status": "Team project",
            "featured": false,
            "context": "Academic team project",
            "team": "4-member team",
            "role": "Contributed to the HCCS system.",
            "summary": "Hides encrypted data inside images and estimates how likely an image holds hidden data.",
            "description": "HCCS hides encrypted text and images inside cover images, and includes a steganalysis module that estimates how likely it is that an image holds hidden data.",
            "overview": "HCCS combines cryptography and steganography. A message is encrypted first and then hidden inside a cover image, so it is both unreadable and unnoticed. A steganalysis module estimates how likely an image is to hold hidden data.",
            "workflow": [
                { "label": "Encrypt", "text": "Text or an image is encrypted with a PBKDF2-HMAC-SHA256 derived key and Fernet." },
                { "label": "Embed", "text": "The ciphertext is hidden in a cover image with LSB embedding, with nibbles masked by BLAKE2b." },
                { "label": "Analyse", "text": "The steganalysis module estimates the likelihood that an image carries hidden data." }
            ],
            "highlights": [
                "Embeds data in cover images with LSB embedding.",
                "Encrypts with PBKDF2-HMAC-SHA256 key derivation and Fernet, and masks nibbles with BLAKE2b.",
                "Adds a steganalysis module that estimates the likelihood of hidden data."
            ],
            "technologies": [
                "Python",
                "Flask",
                "PBKDF2-HMAC-SHA256",
                "Fernet",
                "BLAKE2b"
            ],
            "github": "#",
            "live": "#",
            "image": "assets/images/projects/stegcrypto.svg",
            "imageAlt": "Illustration of a pixel grid with a few highlighted pixels carrying hidden bits"
        }
    ],

    certificates: [
        {
            "title": "DevOps Fundamentals",
            "organization": "Infosys Springboard",
            "link": ""
        },
        {
            "title": "AI For All",
            "organization": "Intel",
            "link": ""
        },
        {
            "title": "AI Tools & ChatGPT Workshop",
            "organization": "be10x",
            "link": ""
        }
    ],

    socials: {
        "email": "syedshoaib22a@gmail.com",
        "github": "https://github.com/syedshoaibb",
        "linkedin": "https://www.linkedin.com/in/syed-madanin-shoaib-3a25b7331"
    }

};
