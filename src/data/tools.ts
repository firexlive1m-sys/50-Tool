import { Tool } from '../types';

export const TOOLS_DATA: Tool[] = [
  {
    id: 'image-converter',
    name: 'Image Converter & Resizer',
    title: 'Free Image Converter Online - PNG to JPG, WEBP & Resizer',
    description: 'Convert and resize images online for free. Support PNG, JPG, WEBP, and GIF formats. High quality compression, client-side safety, and instant processing.',
    keywords: ['image converter', 'png to jpg', 'webp converter', 'resize image online', 'free image resizer', 'bulk image compression'],
    category: 'Images',
    icon: 'Image',
    searchRankScore: 98,
    difficulty: 'Easy',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Free Online Image Converter & Resizer',
      'operatingSystem': 'All',
      'applicationCategory': 'MultimediaApplication',
      'browserRequirements': 'Requires JavaScript. Requires HTML5.',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Convert PNG to JPG, WEBP to PNG, JPG to WEBP, dynamic resizing, quality slider control'
    }, null, 2),
    faq: [
      {
        question: 'Are my images uploaded to any server?',
        answer: 'No, your privacy is 100% secure. All image conversion and resizing happen locally inside your browser using the HTML5 Canvas API. No files ever leave your device.'
      },
      {
        question: 'What image formats do you support?',
        answer: 'We support conversion between PNG, JPEG/JPG, and WEBP formats.'
      },
      {
        question: 'How does the resizer maintain aspect ratio?',
        answer: 'Our image resizer includes a "Lock Aspect Ratio" option that automatically updates the height when you change the width (and vice versa) to prevent stretching.'
      }
    ]
  },
  {
    id: 'pdf-converter',
    name: 'Image to PDF Maker',
    title: 'Convert Images to PDF Online - Free JPG to PDF Converter',
    description: 'Easily convert multiple images (JPG, PNG, WEBP) into a single PDF document. Drag and drop, reorder pages, and customize margins. 100% free and secure.',
    keywords: ['images to pdf', 'jpg to pdf converter', 'png to pdf online', 'convert image to pdf free', 'combine photos to pdf'],
    category: 'PDF',
    icon: 'FilePdf', // we will map this to FileText or FileCode inside our dynamic mapper
    searchRankScore: 95,
    difficulty: 'Medium',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Image to PDF Maker',
      'operatingSystem': 'All',
      'applicationCategory': 'UtilitiesApplication',
      'browserRequirements': 'Requires JavaScript.',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Combine multiple images, drag and drop reordering, custom margins, download secure high-resolution PDF client-side'
    }, null, 2),
    faq: [
      {
        question: 'Is there a limit to the number of images I can add?',
        answer: 'There is no hard limit! You can add as many images as your browser memory permits to merge them into a single PDF.'
      },
      {
        question: 'Is this tool mobile-friendly?',
        answer: 'Yes! You can take pictures directly from your mobile camera and convert them into a consolidated PDF on the fly.'
      }
    ]
  },
  {
    id: 'invoice-generator',
    name: 'Professional Invoice Generator',
    title: 'Free Invoice Generator Online - Professional PDF Invoice Maker',
    description: 'Create and download professional invoices in seconds. Add line items, taxes, discounts, business logo, and client details. Fully offline and instant PDF download.',
    keywords: ['invoice generator', 'free invoice maker', 'pdf invoice creator', 'professional invoice template', 'billing software free'],
    category: 'Finance',
    icon: 'Receipt',
    searchRankScore: 97,
    difficulty: 'Advanced',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Professional PDF Invoice Generator',
      'operatingSystem': 'All',
      'applicationCategory': 'BusinessApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Interactive line item table, automatic subtotal, tax, and discount calculation, dynamic currency symbol selection, business logo rendering, PDF download'
    }, null, 2),
    faq: [
      {
        question: 'Can I add my company logo to the invoice?',
        answer: 'Yes, you can upload your company logo or use our beautiful, high-quality placeholder icons.'
      },
      {
        question: 'Does the invoice generator save my business or client data?',
        answer: 'No, we do not store any client or billing information on our servers. Your data is strictly kept locally in your current browser session.'
      }
    ]
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator & Styler',
    title: 'Free QR Code Generator Online - Create Custom QR Codes',
    description: 'Generate high-quality QR codes for URLs, text, Wi-Fi, or contacts. Customize colors, add central logos, set borders, and download as PNG/SVG instantly.',
    keywords: ['qr code generator', 'custom qr code maker', 'free qr scanner link', 'wifi qr code generator', 'qr code with logo'],
    category: 'Utility',
    icon: 'QrCode',
    searchRankScore: 99,
    difficulty: 'Easy',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Custom QR Code Generator',
      'operatingSystem': 'All',
      'applicationCategory': 'UtilitiesApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Generate custom QR codes from any text or link, interactive color picker, logo uploads, custom padding, download as PNG'
    }, null, 2),
    faq: [
      {
        question: 'Will my generated QR codes expire?',
        answer: 'No! The QR codes are completely static, meaning they do not route through any shorteners. They will work forever and never expire.'
      },
      {
        question: 'Can I add a logo inside the QR code?',
        answer: 'Yes! You can choose from our popular preset logos (Web, Email, Location) or upload your own icon to place it perfectly in the center.'
      }
    ]
  },
  {
    id: 'text-analyzer',
    name: 'Word Counter & Text Tools',
    title: 'Free Word Counter Online - Case Converter & Text Analyzer',
    description: 'Analyze your text instantly with our advanced word counter. Count words, characters, sentences, paragraphs, read-time, and format with standard case converters.',
    keywords: ['word counter', 'character count online', 'case converter', 'text analyzer tool', 'lorem ipsum generator', 'sentence counter'],
    category: 'Text',
    icon: 'FileText',
    searchRankScore: 92,
    difficulty: 'Easy',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Word Counter and Case Converter Suite',
      'operatingSystem': 'All',
      'applicationCategory': 'UtilitiesApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Real-time word and character counting, reading time estimation, sentence and paragraph analyzer, sentence/upper/lower case converter'
    }, null, 2),
    faq: [
      {
        question: 'Does this text counter support non-English characters?',
        answer: 'Yes! It accurately counts words and characters for English, Hindi, Spanish, Arabic, and all other Unicode-based languages.'
      },
      {
        question: 'How is the average reading time calculated?',
        answer: 'The reading time is calculated using a standard benchmark of 200 words per minute (WPM) for adult readers.'
      }
    ]
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    title: 'Free Secure Password Generator - Instant Strong Password Maker',
    description: 'Generate secure, randomized cryptographic passwords to protect your online accounts. Customize length, uppercase/lowercase letters, numbers, and symbols.',
    keywords: ['password generator', 'random password maker', 'secure password tool', 'generate strong password', 'wifi password generator'],
    category: 'Utility',
    icon: 'Lock',
    searchRankScore: 94,
    difficulty: 'Easy',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Cryptographically Secure Password Generator',
      'operatingSystem': 'All',
      'applicationCategory': 'SecurityApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Custom length from 4 to 64 characters, toggle numbers/symbols/letters, visual strength meter, double-click easy copy'
    }, null, 2),
    faq: [
      {
        question: 'How secure are the generated passwords?',
        answer: 'We use the browsers high-grade Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) via window.crypto.getRandomValues. They are highly secure and impossible to guess.'
      },
      {
        question: 'Are my generated passwords stored anywhere?',
        answer: 'Absolutely not. They are generated purely inside your browsers local memory and are cleared as soon as you close or refresh the tab.'
      }
    ]
  },
  {
    id: 'emi-calculator',
    name: 'EMI & Loan Calculator',
    title: 'Free EMI Calculator Online - Loan Monthly Installment Calculator',
    description: 'Calculate your home loan, car loan, or personal loan EMI in seconds. View a detailed repayment schedule, total interest due, and amortization breakdown.',
    keywords: ['emi calculator', 'loan calculator online', 'home loan emi calculator', 'repayment schedule generator', 'personal loan emi'],
    category: 'Finance',
    icon: 'Calculator',
    searchRankScore: 93,
    difficulty: 'Medium',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Advanced Loan EMI Calculator',
      'operatingSystem': 'All',
      'applicationCategory': 'FinanceApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Calculate monthly payments, total interest payable, overall payment breakdown, interactive year-by-year amortization list'
    }, null, 2),
    faq: [
      {
        question: 'What is EMI?',
        answer: 'EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.'
      },
      {
        question: 'How is the monthly interest calculated?',
        answer: 'Interest is calculated on the reducing balance method. Monthly interest = Principal remaining x Monthly interest rate.'
      }
    ]
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Health Calculator',
    title: 'Free BMI Calculator - Body Mass Index Chart & Health Advice',
    description: 'Calculate your Body Mass Index (BMI) instantly. Supports metric and imperial units. Learn about your weight category and receive personalized health recommendations.',
    keywords: ['bmi calculator', 'body mass index calculator', 'calculate bmi free', 'healthy weight range', 'bmi chart and status'],
    category: 'Health',
    icon: 'Activity',
    searchRankScore: 90,
    difficulty: 'Easy',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Body Mass Index Health Tool',
      'operatingSystem': 'All',
      'applicationCategory': 'HealthApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Metric and Imperial conversion inputs, dynamic BMI classification index gauge, ideal weight target calculation, custom advice guidelines'
    }, null, 2),
    faq: [
      {
        question: 'What is a healthy BMI range?',
        answer: 'For most adults, an ideal BMI is in the range of 18.5 to 24.9. A BMI of 25 to 29.9 is considered overweight, and 30 or above is considered obese.'
      },
      {
        question: 'Is BMI accurate for everyone?',
        answer: 'BMI is a helpful general screening indicator. However, it may not be fully accurate for muscular athletes, pregnant women, or elderly individuals as it does not distinguish between muscle mass and fat.'
      }
    ]
  },
  {
    id: 'base64-tool',
    name: 'Base64 Encoder & Decoder',
    title: 'Free Base64 Encoder & Decoder Online - 100% Secure & Fast',
    description: 'Encode plain text into Base64 format or decode Base64 back into readable text instantly. Fully local browser execution for developer keys, API tokens, and private data safety.',
    keywords: ['base64 encoder', 'base64 decoder', 'convert text to base64', 'decode base64 online', 'btoa encoder', 'atob decoder'],
    category: 'Utility',
    icon: 'Lock',
    searchRankScore: 96,
    difficulty: 'Easy',
    schema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Base64 Encoder & Decoder',
      'operatingSystem': 'All',
      'applicationCategory': 'DeveloperApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': 'Real-time text-to-Base64 encoding, safe Base64-to-text decoding, unicode character support, client-side safety guarantee, single-click output copying'
    }, null, 2),
    faq: [
      {
        question: 'How is Base64 encoding processed?',
        answer: 'Our tool performs the Base64 encoding entirely within your browser using high-performance local script APIs, ensuring that your keys or developer passwords never travel over the network.'
      },
      {
        question: 'Is my input text stored or logged?',
        answer: 'Absolutely not. This is a client-side serverless utility. No databases, logs, or external networks are used, which means your text remains 100% confidential.'
      }
    ]
  }
];
