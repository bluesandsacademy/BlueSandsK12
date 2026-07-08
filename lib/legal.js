/*
 * The Blue Sands K12 legal policy pack, verbatim as supplied by the client.
 *
 * Kept as data (not JSX) so the prose keeps its curly quotes and em dashes
 * without JSX escaping, and so every document renders through one template.
 * A section is either `body` (paragraphs) or `contact: true` (the company card).
 * Edit the text here; the page at app/(user)/legal/[slug] needs no changes.
 */

export const COMPANY = {
  name: "Blue Sands Academy / Blue Sands STEM Labs",
  address:
    "Greenland Estate, House 10 Ogombo Road, Subuola Abu Street, Lagos Island, Sangotedo 105102, Lagos, Nigeria",
  email: "support@bluesandstemlabs.com",
  phone: "+234 (0) 813-962-2943",
};

const EFFECTIVE = "15th June, 2026";
const UPDATED = "15th June, 2026";

export const legalDocs = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "terms-of-sale",
    navLabel: "Terms of Sale",
    title: "Terms & Conditions / Terms of Sale",
    description:
      "The terms governing the sale, pre-order, purchase and supply of Blue Sands K12 products.",
    effective: EFFECTIVE,
    updated: UPDATED,
    intro:
      "These Terms & Conditions / Terms of Sale (“Terms”) govern the sale, pre-order, purchase, and supply of products sold under Blue Sands K12, an initiative of Blue Sands Academy / Blue Sands STEM Labs (“Blue Sands,” “we,” “us,” or “our”). By placing an order, making a payment, submitting a pre-order, or otherwise purchasing any Blue Sands K12 product, you agree to be bound by these Terms.",
    sections: [
      {
        title: "Company Details",
        body: [
          "Blue Sands K12 is operated by Blue Sands Academy / Blue Sands STEM Labs.",
          `Address: ${COMPANY.address}`,
          `Email: ${COMPANY.email}`,
          `Phone: ${COMPANY.phone}`,
        ],
      },
      {
        title: "Scope of These Terms",
        body: [
          "These Terms apply to all purchases and pre-orders of Blue Sands K12 physical products, including orders placed by individuals, schools, organizations, institutions, distributors, and resellers through any official Blue Sands sales channel.",
        ],
      },
      {
        title: "Product Nature",
        body: [
          "Blue Sands K12 products sold under this initiative are physical products only unless expressly stated otherwise in writing by Blue Sands. Blue Sands reserves the right to update product descriptions, packaging, components, visuals, technical specifications, and accessories; improve, discontinue, replace, or modify any product or product line; limit product availability; and decline or restrict orders where necessary.",
        ],
      },
      {
        title: "Pre-Orders",
        body: [
          "All Blue Sands K12 orders are treated as pre-orders unless Blue Sands expressly states that a product is immediately available for dispatch. All pre-orders are final, binding, non-cancellable, and subject to these Terms.",
        ],
      },
      {
        title: "Order Process",
        body: [
          "Customers must provide accurate and complete order information including name, email, phone number, delivery address, quantity, and any other information reasonably required by Blue Sands. Blue Sands is not liable for delays or failed delivery arising from incorrect or incomplete customer information.",
        ],
      },
      {
        title: "Pricing",
        body: [
          "All prices are subject to change before order acceptance. Blue Sands reserves the right to correct pricing or listing errors. Shipping, handling, taxes, bank charges, and payment processing fees may be charged separately or included in the final amount payable.",
        ],
      },
      {
        title: "Payment Terms",
        body: [
          "Blue Sands may require full payment upfront before processing or confirming an order. An order is treated as paid only when cleared funds are confirmed. Blue Sands may suspend or refuse any order where payment fails, is reversed, or is flagged as suspicious.",
        ],
      },
      {
        title: "Delivery Window",
        body: [
          "All pre-orders are subject to a fulfilment and delivery window of up to ninety (90) days from payment confirmation unless Blue Sands expressly agrees otherwise in writing. Customers acknowledge that delivery may occur at any time within that 90-day period and that no refund, cancellation, or chargeback right arises merely because delivery has not yet occurred within that window.",
        ],
      },
      {
        title: "Shipping, Logistics & Delivery",
        body: [
          "Blue Sands may use internal delivery teams, third-party couriers, logistics providers, school drop-off arrangements, or partner distribution channels. Blue Sands may deliver in instalments or split shipments where operationally necessary.",
        ],
      },
      {
        title: "No Cancellation Policy",
        body: [
          "Orders and pre-orders are non-cancellable once accepted and paid for. Blue Sands will not accept cancellation requests due to change of mind, delayed internal school approvals, budget changes, or delivery timelines that remain within the stated 90-day fulfilment period.",
        ],
      },
      {
        title: "Returns, Replacements & Refunds",
        body: [
          "Returns, replacements, and refunds are governed by the Blue Sands Refund, Returns & Cancellation Policy. As a general rule, no refunds are available for change of mind, pre-order status, or delivery that remains within the 90-day fulfilment window.",
        ],
      },
      {
        title: "Bulk, School, Organizational & Distributor Orders",
        body: [
          "Additional conditions may apply to school, institutional, reseller, and bulk orders. Unless Blue Sands expressly agrees otherwise in writing, such orders remain subject to the same non-cancellable pre-order structure and limited refund/return rights.",
        ],
      },
      {
        title: "Product Use, Handling & Storage",
        body: [
          "Customers are responsible for proper use, safe handling, and storage of products. Blue Sands is not liable for damage, loss, or performance issues caused by misuse, unauthorized alteration, improper storage, or failure to follow instructions.",
        ],
      },
      {
        title: "Warranties & Disclaimers",
        body: [
          "Except as required by law, products are provided “as is” and “as available.” Blue Sands does not guarantee that every product will be identical to promotional visuals or suitable for every use case unless expressly agreed in writing.",
        ],
      },
      {
        title: "Limitation of Liability",
        body: [
          "To the fullest extent permitted by law, Blue Sands shall not be liable for indirect, incidental, consequential, or reputational losses. Blue Sands’ total liability in connection with any affected order shall not exceed the amount actually paid for that specific product.",
        ],
      },
      {
        title: "Force Majeure",
        body: [
          "Blue Sands shall not be liable for delay, disruption, or non-performance caused by events beyond its reasonable control, including strikes, transportation disruption, regulatory restrictions, supplier failures, or other force majeure events.",
        ],
      },
      {
        title: "Intellectual Property",
        body: [
          "All Blue Sands K12 branding, names, visuals, copy, packaging, educational materials, and related content remain the property of Blue Sands or its licensors and may not be reproduced or exploited without written permission.",
        ],
      },
      {
        title: "Customer Communications",
        body: [
          "By placing an order, customers agree that Blue Sands may contact them by email, phone, SMS, or WhatsApp regarding order confirmation, fulfilment, delivery, support, and legal or service communications.",
        ],
      },
      {
        title: "Termination / Order Refusal",
        body: [
          "Blue Sands reserves the right to refuse, suspend, or terminate any order where fraud is suspected, abusive conduct occurs, payment disputes arise, or fulfilment becomes unlawful or commercially unreasonable.",
        ],
      },
      {
        title: "Complaints",
        body: [
          `Complaints should be sent to ${COMPANY.email} with the customer’s details, order reference, delivery date, and supporting evidence where relevant.`,
        ],
      },
      {
        title: "Governing Law and Jurisdiction",
        body: [
          "These Terms are governed by the laws of the Federal Republic of Nigeria. The courts of Lagos State, Nigeria shall have exclusive jurisdiction over any dispute arising out of or in connection with these Terms or any Blue Sands K12 order.",
        ],
      },
      {
        title: "Changes to These Terms",
        body: [
          "Blue Sands may amend these Terms from time to time. Updated versions take effect once published or otherwise communicated.",
        ],
      },
      { title: "Contact", contact: true },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "refund-policy",
    navLabel: "Refund Policy",
    title: "Refund, Returns & Cancellation Policy",
    description:
      "How refunds, returns, replacements and cancellations work for Blue Sands K12 pre-orders.",
    effective: EFFECTIVE,
    updated: UPDATED,
    intro:
      "This Refund, Returns & Cancellation Policy applies to all purchases and pre-orders of Blue Sands K12 products sold by Blue Sands Academy / Blue Sands STEM Labs.",
    sections: [
      {
        title: "General Position",
        body: [
          "Blue Sands K12 products are sold primarily on a pre-order basis. All pre-orders are final and non-cancellable. By placing an order, you agree that your order is a binding purchase commitment and that you are not entitled to a refund because you changed your mind or because delivery has not yet occurred within the stated 90-day fulfilment window.",
        ],
      },
      {
        title: "Non-Cancellable Orders",
        body: [
          "Once Blue Sands confirms your order and receives payment, the order is non-cancellable.",
        ],
      },
      {
        title: "No Change-of-Mind Returns or Refunds",
        body: [
          "Blue Sands does not accept returns or refunds for change of mind, preference change, finding another option, delays still within the 90-day period, internal customer issues, or inaccurate delivery details supplied by the customer.",
        ],
      },
      {
        title: "When Returns or Refunds May Be Considered",
        body: [
          "Blue Sands may consider a return, replacement, repair, store credit, or refund only where the wrong item was delivered by Blue Sands, the item was materially damaged in transit, or the item has a verified manufacturing defect present at the time of delivery.",
        ],
      },
      {
        title: "Strict Claim Window",
        body: [
          "Transit damage or wrong-item claims must be reported within 48 hours of delivery. Manufacturing defect claims must be raised within 7 days of delivery.",
        ],
      },
      {
        title: "How to Report a Return / Refund Issue",
        body: [
          `Customers should email ${COMPANY.email} with their full name or school name, phone number, order number or payment reference, delivery date, description of the issue, and photographic/video evidence where relevant.`,
        ],
      },
      {
        title: "Conditions for Any Approved Return",
        body: [
          "If Blue Sands approves a return review, the customer must keep the item in substantially the same condition as delivered, retain original packaging where reasonably possible, and make the item available for inspection, pickup, or return shipment as directed.",
        ],
      },
      {
        title: "Bulk, School & Organizational Orders",
        body: [
          "School, institutional, distributor, reseller, and bulk orders are generally non-refundable and non-returnable except where Blue Sands confirms in writing that the wrong products were supplied or there is a verified material defect attributable to Blue Sands.",
        ],
      },
      {
        title: "Shipping Costs on Returns",
        body: [
          "Where Blue Sands determines that a return claim is valid due to Blue Sands’ error or a verified defect, Blue Sands may bear or reimburse reasonable return logistics costs. Otherwise, the customer bears all related shipping and handling costs.",
        ],
      },
      {
        title: "Refund Timing",
        body: [
          "Where Blue Sands approves a refund, it may be processed to the original payment method or another method selected by Blue Sands within a reasonable time, subject to payment processor and bank timelines.",
        ],
      },
      {
        title: "Delivery Within 90 Days Is Not a Refund Event",
        body: [
          "Blue Sands’ fulfilment model allows up to 90 days from payment confirmation for fulfilment and delivery. Delivery not yet completed within that 90-day period does not create a right to cancel, reverse payment, or demand a refund.",
        ],
      },
      {
        title: "Chargebacks and Payment Disputes",
        body: [
          "Customers must contact Blue Sands first before initiating a chargeback. Where a customer initiates an unjustified chargeback in breach of this Policy, Blue Sands may contest the chargeback, suspend future orders, and recover related administrative or legal costs where permitted by law.",
        ],
      },
      {
        title: "Blue Sands’ Final Decision",
        body: [
          "To the extent permitted by law, Blue Sands reserves the right to make the final determination on whether a claim qualifies under this Policy and what remedy, if any, will be offered.",
        ],
      },
      { title: "Contact", contact: true },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "shipping-policy",
    navLabel: "Shipping Policy",
    title: "Shipping & Delivery Policy",
    description:
      "How Blue Sands K12 products are fulfilled and delivered, including the 90-day pre-order window.",
    effective: EFFECTIVE,
    updated: UPDATED,
    intro:
      "This Shipping & Delivery Policy explains how Blue Sands K12 products are fulfilled and delivered by Blue Sands Academy / Blue Sands STEM Labs.",
    sections: [
      {
        title: "Pre-Order Fulfilment Model",
        body: [
          "Blue Sands K12 products are sold primarily on a pre-order basis.",
        ],
      },
      {
        title: "Delivery Timeline",
        body: [
          "Blue Sands aims to fulfil and deliver orders within up to ninety (90) days from payment confirmation. By placing an order, you agree that delivery may occur at any time within that 90-day period and that no refund, cancellation, or chargeback right arises merely because delivery has not yet occurred within that period.",
        ],
      },
      {
        title: "Delivery Locations",
        body: [
          "Blue Sands may deliver to residential addresses, school addresses, office locations, designated pickup points, or centralized institutional delivery points accepted by Blue Sands.",
        ],
      },
      {
        title: "Customer Delivery Responsibilities",
        body: [
          "Customers are responsible for providing correct delivery details, reachable phone numbers, and any special instructions necessary for successful delivery.",
        ],
      },
      {
        title: "Multiple / Split Shipments",
        body: [
          "Blue Sands may deliver products in multiple shipments or stagger school and bulk orders across batches where operationally necessary.",
        ],
      },
      {
        title: "Delivery Delays",
        body: [
          "Delivery timelines may be affected by production schedules, quality control, courier delays, public holidays, security issues, weather, regulatory restrictions, or other factors outside Blue Sands’ reasonable control.",
        ],
      },
      {
        title: "Delivery Attempts / Failed Delivery",
        body: [
          "If delivery fails because the customer is unavailable, unreachable, or provided incorrect details, Blue Sands may reschedule delivery, charge an additional delivery fee, or hold the product pending customer response.",
        ],
      },
      {
        title: "Inspection on Delivery",
        body: [
          "Customers must inspect packages promptly on delivery. Wrong-item or visible transit damage claims must be reported within 48 hours of delivery. Manufacturing defect claims must be raised within 7 days, subject to the Refund, Returns & Cancellation Policy.",
        ],
      },
      {
        title: "Risk and Title",
        body: [
          "Risk in the product passes upon delivery to the customer, school, institution, or nominated recipient. Title may remain with Blue Sands until full payment has been received and cleared.",
        ],
      },
      {
        title: "Shipping Fees",
        body: [
          "Shipping, delivery, logistics, and handling charges may be included in the displayed price, charged separately, quoted on invoice, or otherwise communicated before order confirmation.",
        ],
      },
      {
        title: "International / Out-of-State / Bulk Deliveries",
        body: [
          "Certain bulk, institutional, or interstate orders may be subject to separate delivery arrangements, special freight handling, or adjusted delivery timelines.",
        ],
      },
      { title: "Contact", contact: true },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "privacy-policy",
    navLabel: "Privacy Policy",
    title: "Privacy Policy",
    description:
      "What personal information Blue Sands K12 collects, how it is used, and how it is protected.",
    effective: EFFECTIVE,
    updated: UPDATED,
    intro:
      "Blue Sands Academy / Blue Sands STEM Labs (“Blue Sands,” “we,” “us,” or “our”) respects your privacy and is committed to protecting the personal information you provide when you interact with Blue Sands K12.",
    sections: [
      {
        title: "Information We Collect",
        body: [
          "We may collect personal and organizational information such as name, school or organization name, email address, phone number, WhatsApp number, billing and delivery address, order and payment information, school population data shared for quotation purposes, communication records, and website usage data where applicable.",
        ],
      },
      {
        title: "How We Use Your Information",
        body: [
          "We may use your information to process and manage orders, verify payments, prevent fraud, contact you about fulfilment and support, prepare quotations and school proposals, improve our services, comply with legal obligations, and send marketing communications where permitted.",
        ],
      },
      {
        title: "Payments",
        body: [
          "Payments may be processed through third-party payment processors such as Paystack or other approved providers. Customers should review the privacy terms of such processors where relevant.",
        ],
      },
      {
        title: "Sharing of Information",
        body: [
          "We may share information with payment processors, logistics partners, technology and communications service providers, professional advisers, regulators where required by law, and schools or designated recipients where necessary to coordinate orders and deliveries.",
        ],
      },
      {
        title: "Data Retention",
        body: [
          "We retain information for as long as reasonably necessary for order fulfilment, support, business records, legal compliance, dispute resolution, fraud prevention, and enforcement of our policies and contracts.",
        ],
      },
      {
        title: "Customer Responsibility for Data Provided",
        body: [
          "Where a school or organization provides information about staff, students, parents, or representatives, that school or organization is responsible for ensuring it has the right and lawful basis to share that information with Blue Sands.",
        ],
      },
      {
        title: "Security",
        body: [
          "Blue Sands takes reasonable administrative, technical, and organizational measures to protect personal information, but cannot guarantee absolute security.",
        ],
      },
      {
        title: "Cookies and Website Data",
        body: [
          "Our website may use cookies, analytics tools, and similar technologies to improve site performance, remember preferences, analyze traffic, and support functionality.",
        ],
      },
      {
        title: "Marketing Communications",
        body: [
          "Where permitted, Blue Sands may send updates about products, events, demos, school opportunities, or related communications. You may opt out of non-essential marketing communications at any time.",
        ],
      },
      {
        title: "Your Rights",
        body: [
          "Subject to applicable law, you may request access to, correction of, or deletion of certain personal information we hold about you, or object to or restrict certain processing where applicable.",
        ],
      },
      {
        title: "Children’s Information",
        body: [
          "Blue Sands K12 primarily sells to parents, schools, institutions, and authorized adult representatives. We do not knowingly collect personal information directly from children through the purchase process without appropriate adult involvement.",
        ],
      },
      {
        title: "Changes to This Policy",
        body: [
          "Blue Sands may update this Privacy Policy from time to time. Updated versions take effect once published or otherwise communicated.",
        ],
      },
      { title: "Contact", contact: true },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "terms-of-service",
    navLabel: "Terms of Service",
    title: "Terms of Service / Website Terms of Use",
    description:
      "The terms governing access to and use of the Blue Sands K12 website and related digital channels.",
    effective: EFFECTIVE,
    updated: UPDATED,
    intro:
      "These Terms of Service / Website Terms of Use govern access to and use of the Blue Sands K12 website, related Blue Sands STEM Labs pages, and any associated digital content, forms, checkout pages, and communications channels used for the Blue Sands K12 initiative.",
    sections: [
      {
        title: "Who We Are",
        body: [
          "Blue Sands K12 is an initiative of Blue Sands Academy / Blue Sands STEM Labs.",
        ],
      },
      {
        title: "Acceptable Use",
        body: [
          "You agree to use the website and any related service only for lawful purposes and in a manner that does not infringe the rights of Blue Sands or any third party.",
        ],
      },
      {
        title: "Accounts, Forms & Submissions",
        body: [
          "Where you submit a form, enquiry, pre-order, application, or request through the website, you agree to provide accurate and complete information. Blue Sands may reject or suspend submissions that are false, incomplete, abusive, fraudulent, or operationally unsuitable.",
        ],
      },
      {
        title: "Product Information & Website Content",
        body: [
          "Blue Sands tries to keep website content accurate and current, but does not guarantee that all information, pricing, descriptions, timelines, or visuals are complete, current, or error-free at all times.",
        ],
      },
      {
        title: "Pre-Orders, Sales & Payment Links",
        body: [
          "Any purchase, pre-order, invoice, or payment made through the website or linked sales channel is additionally governed by the Blue Sands Terms & Conditions / Terms of Sale, Shipping Policy, and Refund Policy.",
        ],
      },
      {
        title: "Intellectual Property",
        body: [
          "All content on the website—including text, branding, logos, graphics, product names, images, videos, design elements, layouts, and educational materials—is owned by or licensed to Blue Sands and may not be copied, reproduced, republished, distributed, modified, or exploited without prior written consent.",
        ],
      },
      {
        title: "Third-Party Services and Links",
        body: [
          "The website may contain links to third-party platforms, payment providers, social platforms, or external sites. Blue Sands is not responsible for the content, privacy practices, security, or availability of such third-party services.",
        ],
      },
      {
        title: "Website Availability",
        body: [
          "Blue Sands does not guarantee uninterrupted or error-free operation of the website. Access may be suspended or interrupted for maintenance, upgrades, security issues, technical failures, or other reasons beyond Blue Sands’ control.",
        ],
      },
      {
        title: "Disclaimers",
        body: [
          "To the fullest extent permitted by law, the website and related services are provided on an “as is” and “as available” basis.",
        ],
      },
      {
        title: "Limitation of Liability",
        body: [
          "To the fullest extent permitted by law, Blue Sands shall not be liable for indirect, incidental, consequential, punitive, or special damages arising from use of the website or reliance on website content. Where liability is established, Blue Sands’ total liability shall not exceed the amount, if any, paid directly to Blue Sands in connection with the relevant transaction.",
        ],
      },
      {
        title: "Privacy",
        body: [
          "Use of the website is also subject to the Blue Sands Privacy Policy.",
        ],
      },
      {
        title: "Suspension or Termination",
        body: [
          "Blue Sands may suspend, restrict, or terminate access to the website or any user interaction with it where Blue Sands reasonably believes there has been fraud, misuse, unlawful conduct, abusive behavior, or breach of these Terms.",
        ],
      },
      {
        title: "Governing Law",
        body: [
          "These Terms of Service are governed by the laws of the Federal Republic of Nigeria. The courts of Lagos State, Nigeria shall have exclusive jurisdiction over disputes arising from or connected with the website or these Terms.",
        ],
      },
      {
        title: "Changes to These Terms",
        body: [
          "Blue Sands may update these Terms of Service at any time. Updated versions become effective once posted on the website or otherwise communicated.",
        ],
      },
      { title: "Contact", contact: true },
    ],
  },
];

export function getLegalDoc(slug) {
  return legalDocs.find((d) => d.slug === slug) || null;
}

// Footer / cross-navigation links, in the order they should be presented.
export const legalLinks = legalDocs.map((d) => ({
  name: d.navLabel,
  href: `/legal/${d.slug}`,
}));
