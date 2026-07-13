// The 30-email AR Pedia demo campaign, as structured copy plus one shared
// house-style HTML renderer. Copy is transcribed from the campaign brief and
// deliberately kept free of em dashes and stock-LLM phrasing (see AGENTS.md).
//
// A block is either a string (paragraph) or an array of strings (bullet list).
// Every email drives to the same registration meta block + CTA, and carries an
// unsubscribe footer. Send times come from lib/campaign-schedule.js.
import {
  EVENT_DATE,
  EVENT_TIME_LABEL,
  longDate,
} from "@/lib/campaign-schedule";

export const REGISTER_URL =
  process.env.CAMPAIGN_REGISTER_URL || "https://luma.com/z307o8sk";
export const SENDER_ADDRESS =
  process.env.CAMPAIGN_SENDER_ADDRESS || "Blue Sands STEM Labs, Lagos, Nigeria";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bluesandsk12.com";
const LOGO_URL = `${SITE_URL}/android-chrome-192x192.png`;
// Web-safe stack with the same feel as the site; email clients can't load
// webfonts reliably, so we do not attempt to.
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const NAVY = "#02345a";
const BLUE = "#0483e2";
const INK = "#334155";

export const CAMPAIGN_SEQUENCE = [
  {
    n: 1,
    key: "e01-registration-open",
    dayOffset: 0,
    time: "09:00",
    angle: "Registration is open",
    subject:
      "You're invited: Blue Sands K12 AR Pedia Demo Live | Friday 24th July, 10:00 AM",
    previewText:
      "See augmented reality and virtual science labs transform your classroom, live, free, online.",
    signoff: "Warm regards,",
    blocks: [
      "What if every student in your school could step inside a science experiment, hold a beating heart in their hands, watch a chemical reaction unfold safely on their desk, and explore the solar system without leaving the classroom?",
      "That is exactly what we will show you at the Blue Sands K12 AR Pedia Demo Live, a free online session for school owners, principals, ICT coordinators, and teachers.",
      "In one hour, you will:",
      [
        "Experience AR Pedia's augmented reality lessons and 3D models in action.",
        "Watch live virtual experiments across Physics, Chemistry, and Biology.",
        "See the teacher dashboard, assessments, and progress tracking up close.",
        "Get clear answers on onboarding, pricing, training, and support, with no jargon and no pressure.",
      ],
      "Seats are managed through registration, so we encourage you to secure your spot today.",
    ],
  },
  {
    n: 2,
    key: "e02-inside-the-demo",
    dayOffset: 0,
    time: "14:00",
    angle: "Inside the demo",
    subject: "Here's exactly what you'll see at the AR Pedia live demo",
    previewText:
      "A guided tour of the platform 100+ schools already use, in one focused hour.",
    signoff: "Kind regards,",
    blocks: [
      "This morning we invited you to our live demonstration on Friday 24th July. Here is a closer look at what the session will cover, so you know precisely what you and your team will get out of the hour.",
      "The live walk-through includes:",
      [
        "AR Pedia in action: augmented reality lessons that turn abstract topics into 3D experiences students can see, rotate, and explore.",
        "Virtual science laboratories: 150+ interactive simulations and experiments, run live on screen.",
        "Teacher tools: lesson assignment, class management, and marking made simple.",
        "Assessments and analytics: how you track understanding per student, per class, per term.",
        "Implementation: what rollout looks like for a school your size, step by step.",
      ],
      "You will also be able to ask questions live and get direct answers from our team.",
      "Registration takes less than a minute, and your Google Meet link arrives instantly.",
    ],
  },
  {
    n: 3,
    key: "e03-weekend-read-test-tube",
    dayOffset: 1,
    time: "10:00",
    angle: "Weekend read: why practical science can't wait",
    subject: "Weekend read: the students who never touched a test tube",
    previewText:
      "A quieter thought for your Saturday, about what students lose when science stays on the page.",
    signoff: "Warm regards,",
    blocks: [
      "It's the weekend, so no hard sell today, just a thought worth sitting with over your morning tea.",
      "Every year, thousands of students finish secondary school having passed science subjects they never once practised. They can recite the procedure for a titration but have never watched the colour change. They can label a diagram of the heart but have never seen one beat.",
      "The cost isn't only in exam results, it's in curiosity. A student who has never done science rarely falls in love with it, and the doctors, engineers, and innovators we need begin as children who got to try.",
      'That is the quiet mission behind Blue Sands K12 AR Pedia: making "getting to try" possible in every school, regardless of what its laboratory looks like.',
      "If that mission resonates, come and see it in action on Friday 24th July at 10:00 AM. Registration is free and takes under a minute.",
      "Enjoy your weekend.",
    ],
  },
  {
    n: 4,
    key: "e04-what-is-ar-pedia",
    dayOffset: 1,
    time: "16:00",
    angle: "What exactly is AR Pedia?",
    subject: "What exactly is AR Pedia? (2-minute read)",
    previewText:
      "Augmented reality, virtual labs and assessments, in one platform built for K-12.",
    signoff: "Kind regards,",
    blocks: [
      "You may be wondering what makes AR Pedia different from the many e-learning tools already out there. In short: it doesn't just display content, it lets students interact with it.",
      "Blue Sands K12 AR Pedia combines three things in one platform:",
      [
        "Augmented reality lessons: 3D models of the human heart, atomic structures, ecosystems, and machines that appear right in front of students, ready to be rotated, dissected, and explored.",
        "Virtual laboratories: 150+ curriculum-mapped simulations across Physics, Chemistry, Biology, and Mathematics, where students change variables and see real outcomes.",
        "Assessment and tracking: built-in quizzes and analytics so teachers know exactly who has understood what.",
      ],
      "It is one platform, one login, and one simple rollout for your whole school.",
      "The best way to understand it is to see it. Join us live:",
    ],
  },
  {
    n: 5,
    key: "e05-monday-morning-story",
    dayOffset: 2,
    time: "10:00",
    angle: "A Monday morning with AR Pedia (a classroom story)",
    subject: "A Monday morning with AR Pedia (a short story)",
    previewText:
      "9:05 AM, SS2 Chemistry, forty students, one screen, and everything changes.",
    signoff: "Warm regards,",
    blocks: [
      "Picture a Monday morning in an SS2 Chemistry class.",
      "At 9:05 AM, the teacher opens the day's lesson on the projector: the reactivity series. But instead of a chart to copy, a virtual laboratory appears. She drops potassium into water, and the class gasps as it ignites on screen. Then sodium. Then calcium. Forty students watch the pattern reveal itself, reaction by reaction.",
      "Then it's their turn. In pairs on the school's devices, students run the same experiment themselves: predicting, testing, getting it wrong, trying again. No burns, no wasted reagents, no queue for one demonstration at the front.",
      "By 9:40, the built-in assessment tells the teacher precisely who understood and who needs another pass, before the class has even ended.",
      "That is an ordinary lesson on Blue Sands K12 AR Pedia. On Friday 24th July, we'll show you this exact flow, live.",
      "Have a restful Sunday.",
    ],
  },
  {
    n: 6,
    key: "e06-exam-connection",
    dayOffset: 2,
    time: "16:00",
    angle: "The exam connection: practicals, WAEC and NECO",
    subject: "The practical questions your students shouldn't fear",
    previewText:
      "Practical familiarity shows up in exam results. Here's how AR Pedia builds it, term after term.",
    signoff: "Kind regards,",
    blocks: [
      "Every school leader knows the pattern: students who have actually performed experiments walk into practical exams calm and prepared. Students who only memorised procedures walk in hoping the questions are kind.",
      "Blue Sands K12 AR Pedia is mapped to the curriculum your school already follows, including WAEC and NECO requirements, so every simulation a student runs is direct preparation for what they will be examined on. They can repeat a practical five, ten, twenty times until the procedure is second nature, long before they meet it under exam conditions.",
      "At Friday's demo, we'll show exactly how lessons map to the syllabus and how teachers use assessments to close gaps before exam season, not after.",
    ],
  },
  {
    n: 7,
    key: "e07-the-lab-gap",
    dayOffset: 3,
    time: "09:00",
    angle: "The science lab gap in our schools",
    subject: "Can every student in your school run a real science experiment?",
    previewText:
      "Most students learn science in theory for years before they ever see it in practice. It doesn't have to be that way.",
    signoff: "Warm regards,",
    blocks: [
      "Across Africa, the picture is familiar: laboratories that are under-equipped or non-existent, reagents that are too costly to replace, and experiments too dangerous to attempt with a full class. The result is that many students meet practical science for the first time in an exam hall.",
      "Blue Sands K12 AR Pedia was built to close that gap. It puts a complete, safe, repeatable laboratory into any classroom with a screen, so a student can perform a titration, dissect a specimen, or build a circuit as many times as it takes to truly understand it, at a fraction of the cost of physical equipment.",
      "No broken apparatus. No safety risks. No student left watching from the back row.",
      "See it working live at our demonstration:",
    ],
  },
  {
    n: 8,
    key: "e08-curriculum-offline",
    dayOffset: 3,
    time: "14:00",
    angle: "Curriculum-aligned and offline-friendly",
    subject: "Curriculum-aligned. Offline-friendly. Built for our schools.",
    previewText:
      "AR Pedia follows the schemes of work your teachers already use, and works with limited bandwidth.",
    signoff: "Warm regards,",
    blocks: [
      "The two questions school leaders ask us most often:",
      '"Will it fit our curriculum?" Yes. AR Pedia is mapped to the curriculum your teachers already follow, including alignment to WAEC and NECO requirements. It slots into existing schemes of work; it does not replace them or add a parallel workload.',
      '"What about our internet?" We built for reality. AR Pedia includes lighter, offline-friendly options so that limited bandwidth never stands between your students and their lessons. If your school runs on modest connectivity, this platform was designed with you in mind.',
      "We will demonstrate both live, including how a lesson runs in a low-bandwidth environment:",
    ],
  },
  {
    n: 9,
    key: "e09-built-for-teachers",
    dayOffset: 4,
    time: "09:00",
    angle: "Built for teachers",
    subject: "Built for teachers, not just students",
    previewText:
      "Assign, teach, track, from one dashboard, with almost no setup.",
    signoff: "Kind regards,",
    blocks: [
      "Classroom technology only works when it makes a teacher's day easier, not longer. That principle shaped everything about AR Pedia's teacher experience.",
      "From a single dashboard, your teachers can:",
      [
        "Assign experiments and AR lessons to a class in a few clicks.",
        "Guide the whole class through a simulation in real time.",
        "See instantly who is keeping up and who needs support.",
        "Review assessment results without manual marking.",
      ],
      "At the demo, we will walk through a teacher's full journey: planning a lesson, running it, and reviewing the results, so your staff can picture their own Monday morning with AR Pedia.",
      "Teacher training and onboarding support are included, and we'll explain how that works too.",
    ],
  },
  {
    n: 10,
    key: "e10-what-students-get",
    dayOffset: 4,
    time: "14:00",
    angle: "What your students will get",
    subject: "From memorising science to doing science",
    previewText:
      "Experiments they can run, mistakes they can safely make, and progress everyone can see.",
    signoff: "Warm regards,",
    blocks: [
      "Ask a student to memorise the stages of electrolysis and they will forget it by next term. Let them run the electrolysis themselves, change the electrolyte, adjust the current, and watch what happens, and they will carry it into the exam hall and beyond.",
      "With AR Pedia, your students can:",
      [
        "Run experiments hands-on, adjusting variables and observing real outcomes.",
        "Explore 3D augmented reality models that make abstract concepts concrete.",
        "Repeat any experiment as many times as they need. Failure is free and safe.",
        "Complete built-in assessments that show exactly how much they've understood.",
      ],
      "Progress tracking means teachers, and parents, can follow each student's growth across the term, not just at report card time.",
      "Come and watch students' favourite simulations live:",
    ],
  },
  {
    n: 11,
    key: "e11-dangerous-safe",
    dayOffset: 5,
    time: "09:00",
    angle: "Dangerous experiments, made completely safe",
    subject: "The experiments too dangerous to run, until now",
    previewText:
      "Concentrated acids, open flames, live circuits: your students can now do them all, with zero risk.",
    signoff: "Warm regards,",
    blocks: [
      "Some of the most memorable experiments in the curriculum are the ones schools quietly skip: reactions involving concentrated acids, open flames, volatile gases, or mains electricity. The learning value is enormous, and so is the risk with a class of forty.",
      "In AR Pedia's virtual laboratories, those experiments come back into the classroom. Students handle the hazardous reactions themselves, observe what makes them dangerous, and even see what happens when a procedure is done wrongly, a lesson no responsible teacher could ever stage physically.",
      "Safe hands-on learning also means no insurance worries, no fume cupboards, and no reagent budget climbing every term.",
      "We'll run one of these otherwise impossible experiments live at the demo:",
    ],
  },
  {
    n: 12,
    key: "e12-rollout-affordability",
    dayOffset: 5,
    time: "14:00",
    angle: "Rollout, pricing and support",
    subject:
      "A STEM lab your school can roll out this term, without a construction budget",
    previewText:
      "Affordable per-term pricing, no expensive hardware, and setup measured in days, not months.",
    signoff: "Kind regards,",
    blocks: [
      "A conventional science laboratory means capital budgets, equipment procurement, maintenance contracts, and timelines that stretch across sessions. AR Pedia was deliberately designed to be different:",
      [
        "Affordable per-term pricing, per student or per school, so you pay in a way that matches your enrolment.",
        "No expensive hardware. It runs on the devices your school already has.",
        "Fast setup. Most schools are fully up and running well within a single term.",
        "Ongoing support: training, onboarding, and a team that picks up the phone.",
      ],
      "At the demo we will present the actual pricing and licensing options openly, so you leave with real numbers you can take to your board or proprietor.",
    ],
  },
  {
    n: 13,
    key: "e13-proof",
    dayOffset: 6,
    time: "09:00",
    angle: "Proof: 20,000+ students already learning this way",
    subject: "20,000+ students. 100+ schools. 6 countries. Here's why.",
    previewText:
      "Blue Sands is already part of everyday learning, backed by LASRIC, NITDA, NTI, and CcHUB.",
    signoff: "Warm regards,",
    blocks: [
      "You don't have to take our word for it. Blue Sands STEM Labs is already part of everyday teaching and learning for:",
      [
        "20,000+ students actively learning on the platform.",
        "100+ schools across 6 countries.",
        "150+ interactive simulations and AR experiences in use every school day.",
      ],
      "Our work is supported by partners including LASRIC, NITDA, the National Teachers' Institute (NTI), CcHUB, and ReLearn, institutions that scrutinised the platform before putting their names beside it.",
      "At the demo, we'll share what adoption actually looked like in real schools: what worked, what surprised them, and what results followed.",
    ],
  },
  {
    n: 14,
    key: "e14-who-should-attend",
    dayOffset: 6,
    time: "14:00",
    angle: "Who should attend (bring your team)",
    subject: "Who should be in the room on the 24th (forward this to them)",
    previewText:
      "The demo lands best when decision-makers and classroom leaders attend together.",
    signoff: "Kind regards,",
    blocks: [
      "The schools that get the most from our demonstrations are the ones that attend as a team, the person who decides sitting alongside the people who will teach.",
      "The session on Friday 24th July is designed for:",
      [
        "School owners, proprietors, and principals, for the pricing, rollout, and impact picture.",
        "ICT and e-learning coordinators, for setup, devices, and bandwidth questions.",
        "Science teachers and heads of department, for the day-to-day classroom experience.",
      ],
      "If a colleague fits any of these, please forward this email. They can register with the same link in under a minute.",
    ],
  },
  {
    n: 15,
    key: "e15-one-week-to-go",
    dayOffset: 7,
    time: "09:00",
    angle: "One week to go",
    subject: "One week today: AR Pedia goes live on your screen",
    previewText:
      "Friday 24th July, 10:00 AM. Register now and your Google Meet link is waiting.",
    signoff: "Warm regards,",
    blocks: [
      "Exactly one week from today, we go live with the Blue Sands K12 AR Pedia demonstration: augmented reality lessons, virtual laboratories, teacher tools, and open Q&A, all in one focused hour.",
      "If you've been meaning to register, now is the perfect moment. It takes less than a minute, and your joining link is delivered instantly.",
      "Already registered? Wonderful. Keep an eye on your inbox next week for the agenda and a calendar reminder.",
    ],
  },
  {
    n: 16,
    key: "e16-what-a-lab-costs",
    dayOffset: 7,
    time: "14:00",
    angle: "The cost of a lab: physical vs virtual",
    subject: "What a science lab really costs (and the alternative)",
    previewText:
      "Equipment, reagents, maintenance, replacement, versus one per-term subscription.",
    signoff: "Kind regards,",
    blocks: [
      "If you have ever priced a physical laboratory, you know the arithmetic: benches and plumbing, apparatus for every workstation, reagents that expire and must be re-bought every term, breakages, storage, safety equipment, and a technician to maintain it all. And after all that, one laboratory still serves one class at a time.",
      "Blue Sands K12 AR Pedia changes the equation. One affordable per-term subscription gives every class, simultaneously, access to 150+ experiments and AR lessons, with nothing to break, expire, restock, or maintain.",
      "It doesn't replace the ambition of a physical lab; it means your students don't have to wait for one.",
      "We'll put the actual numbers side by side at Friday's demo, so you can judge for yourself:",
    ],
  },
  {
    n: 17,
    key: "e17-weekend-read-future-jobs",
    dayOffset: 8,
    time: "10:00",
    angle: "Weekend read: preparing students for tomorrow's jobs",
    subject:
      "Weekend read: the jobs your students will do haven't been invented yet",
    previewText:
      "A Saturday reflection on what schools can do today about a future nobody can predict.",
    signoff: "Warm regards,",
    blocks: [
      "A Saturday thought, from our team to yours.",
      "Most of today's primary school pupils will work in roles that don't yet exist, in AI, robotics, green energy, biotechnology, and fields we haven't named. We cannot teach them the specifics of jobs nobody has seen. What we can teach is the underlying muscle: curiosity, experimentation, comfort with technology, and the confidence to try, fail, and try again.",
      "That muscle is built in practice, not in dictation. A student who spends her school years running experiments, testing hypotheses, and exploring 3D models is being prepared for any future, whatever it looks like.",
      "This is the deeper case for immersive STEM learning, and it's the case we'll make, with live proof, next Friday at 10:00 AM.",
      "Have a lovely weekend.",
    ],
  },
  {
    n: 18,
    key: "e18-sneak-peek",
    dayOffset: 8,
    time: "16:00",
    angle: "5 experiments we'll run live on Friday",
    subject: "Sneak peek: 5 experiments we'll run live on Friday",
    previewText:
      "From a beating 3D heart to a circuit your students build themselves, here's the line-up.",
    signoff: "Kind regards,",
    blocks: [
      "Want a preview? Here are five of the experiences we plan to run live at Friday's demonstration:",
      [
        "The beating heart: an AR model of the human heart your students can walk around, open up, and watch pump in real time.",
        "Acid-base titration: the classic WAEC practical, performed start to finish with live colour change.",
        "Circuit building: students assemble a working circuit, then break it on purpose to learn why it fails.",
        "The reactive metals: potassium, sodium, and their neighbours meeting water, safely.",
        "Inside a plant cell: a Biology journey from the leaf down to the chloroplast, in 3D.",
      ],
      "Every one of these runs on the same platform your teachers would use in class the very next day.",
    ],
  },
  {
    n: 19,
    key: "e19-back-of-the-lab",
    dayOffset: 9,
    time: "10:00",
    angle: "Getting every student involved",
    subject: "The students at the back of the lab",
    previewText:
      "When there's one apparatus and forty students, who actually gets to do the experiment?",
    signoff: "Warm regards,",
    blocks: [
      "Here is a quiet truth about practical classes: when there is one set of apparatus and forty students, only a few hands ever touch the experiment. Too often it's the same confident few, while the students who most need the encouragement, including many of our girls, watch from the back.",
      "Virtual laboratories change that arithmetic completely. On AR Pedia, every single student runs every single experiment, at their own pace, without an audience, free to be wrong and try again. Teachers consistently tell us the biggest surprise is who starts to flourish: the quiet ones, the hesitant ones, the students no one expected.",
      "Every child a scientist, not just the ones who push to the front. That's the classroom we'll show you on Friday.",
    ],
  },
  {
    n: 20,
    key: "e20-your-questions",
    dayOffset: 9,
    time: "16:00",
    angle: "Send us your questions, we'll answer them live",
    subject: "What would you ask us? (We'll answer it live on Friday)",
    previewText:
      "Reply with your toughest question, pricing, curriculum, devices, anything, and we'll take it on live.",
    signoff: "Kind regards,",
    blocks: [
      "Friday's demonstration ends with a live, unscripted Q&A, and we'd love to prepare answers to the questions that matter most to you.",
      "So here's an invitation: simply reply to this email with the one question you'd most want answered about Blue Sands K12 AR Pedia. Pricing, curriculum fit, devices, teacher training, data protection, offline use, nothing is off the table.",
      "We'll address the most common questions directly during the session, and take the rest live.",
      "Not registered yet? The link below secures your seat in under a minute.",
    ],
  },
  {
    n: 21,
    key: "e21-demo-week-agenda",
    dayOffset: 10,
    time: "09:00",
    angle: "It's demo week, the full agenda",
    subject: "It's demo week: here's the full agenda for Friday",
    previewText: "One hour, five segments, live Q&A. Come with your questions.",
    signoff: "Kind regards,",
    blocks: [
      "The live demonstration is this Friday. Here is how we will spend the hour together:",
      [
        "10:00, Welcome and the story behind Blue Sands K12 AR Pedia.",
        "10:10, Live AR experience: 3D lessons students can touch and explore.",
        "10:20, Virtual laboratory walk-through: experiments in Physics, Chemistry, and Biology.",
        "10:35, The teacher's view: assigning, tracking, and assessing a class.",
        "10:45, Pricing, rollout, and support, followed by open Q&A.",
      ],
      "Bring your ICT coordinator and science lead if you can. The Q&A is where the most practical questions get answered.",
    ],
  },
  {
    n: 22,
    key: "e22-devices-setup",
    dayOffset: 10,
    time: "14:00",
    angle: "What you need to join (and to run AR Pedia)",
    subject:
      "What you need for Friday (and what your school needs for AR Pedia)",
    previewText: "Short answer: less than you think. Here's the checklist.",
    signoff: "Warm regards,",
    blocks: [
      "Two practical checklists ahead of Friday.",
      "To join the demo, you only need:",
      [
        "Any device with a browser: phone, tablet, or laptop.",
        "The Google Meet link from your Luma registration confirmation.",
        "A notepad for the pricing figures we'll share.",
      ],
      "To run AR Pedia in your school, you need less than most leaders expect:",
      [
        "It works on the devices your school already has, with no specialised hardware to purchase.",
        "Modest internet is enough, with offline-friendly options for lighter connectivity.",
        "Setup is guided by our team, and teacher training is included.",
      ],
      "We'll go through the full requirements openly during the session, so your ICT coordinator can plan with confidence.",
    ],
  },
  {
    n: 23,
    key: "e23-company-behind",
    dayOffset: 11,
    time: "09:00",
    angle: "The company behind the platform",
    subject: "The team behind AR Pedia, and the partners who back us",
    previewText:
      "Built in Lagos, used in 6 countries, supported by LASRIC, NITDA, NTI, CcHUB, and ReLearn.",
    signoff: "Warm regards,",
    blocks: [
      "Before you give a platform a place in your school, you deserve to know who built it and who stands behind it.",
      "Blue Sands STEM Labs is a Nigerian EdTech company, built in Lagos by educators and engineers who know our classrooms first-hand: the class sizes, the bandwidth, the budgets, and the curriculum. That local grounding is why the platform works in the real conditions of our schools, not just in a brochure.",
      "Our work is supported and validated by partners including LASRIC, NITDA, the National Teachers' Institute (NTI), CcHUB, and ReLearn, and the platform now serves 20,000+ students across 6 countries.",
      "On Friday, you'll meet the team live, and you can ask us anything.",
    ],
  },
  {
    n: 24,
    key: "e24-3-days-out",
    dayOffset: 11,
    time: "14:00",
    angle: "3 days out, the questions we'll answer live",
    subject: "3 days to go: the questions we'll answer live on Friday",
    previewText:
      "Cost? Curriculum? Internet? Devices? Training? All answered, with real numbers.",
    signoff: "Warm regards,",
    blocks: [
      "In three days, we go live. These are the questions school leaders ask us most, and every one of them will be answered openly during Friday's session:",
      [
        '"What will it cost my school per term?" We\'ll show the actual pricing options.',
        '"Does it follow our curriculum and exam requirements?" We\'ll show the mapping.',
        '"Our internet is unreliable. Will it still work?" We\'ll demonstrate the offline-friendly mode.',
        '"What devices do we need?" Less than you think; we\'ll cover the minimum setup.',
        '"How do our teachers learn to use it?" We\'ll explain training and onboarding, included.',
      ],
      "Have a question we haven't listed? Bring it. The Q&A is live and unscripted.",
    ],
  },
  {
    n: 25,
    key: "e25-48-hours",
    dayOffset: 12,
    time: "09:00",
    angle: "48 hours: what you'll walk away with",
    subject: "48 hours to go: here's what you'll walk away with",
    previewText: "One hour on Friday. Five concrete takeaways for your school.",
    signoff: "Warm regards,",
    blocks: [
      "In 48 hours, we go live. Attend the full session and you will leave with:",
      [
        "A first-hand feel for AR Pedia: you'll have seen the AR lessons and virtual labs running live, not in a slideshow.",
        "Real pricing: actual per-term figures you can take straight to your board or proprietor.",
        "A rollout picture: what implementation looks like for a school your size, week by week.",
        "Answers to your specific questions, from our team, live and on the record.",
        "A clear next step, whether that's a pilot, a full rollout, or simply more information.",
      ],
      "One hour of your Friday morning, in exchange for total clarity on whether this belongs in your school.",
    ],
  },
  {
    n: 26,
    key: "e26-last-call",
    dayOffset: 12,
    time: "14:00",
    angle: "Last call to register + forward to a colleague",
    subject: "Last call: registration for Friday's AR Pedia demo",
    previewText:
      "Two days left. One minute to register. One hour that could change science class at your school.",
    signoff: "Kind regards,",
    blocks: [
      "This is our last full reminder before demo day. If you plan to join us, or someone at your school should, this is the moment to lock it in.",
      "Friday, in one hour, you will see augmented reality lessons, live virtual experiments, the teacher dashboard, transparent pricing, and a live Q&A with our team.",
      "And one small favour: if you know a school owner, principal, or science teacher who should see this, forward this email. The best sessions are the ones where colleagues attend together.",
    ],
  },
  {
    n: 27,
    key: "e27-tomorrow",
    dayOffset: 13,
    time: "09:00",
    angle: "Tomorrow at 10:00 AM",
    subject: "Tomorrow at 10:00 AM: Blue Sands K12 AR Pedia goes live",
    previewText: "Add it to your calendar now and join a few minutes early.",
    signoff: "Warm regards,",
    blocks: [
      "Tomorrow morning, we go live.",
      "One hour. Augmented reality in action, virtual laboratories, teacher tools, real pricing, and your questions answered on the spot.",
      "Two quick things to do today:",
      [
        "If you haven't registered yet, do it now. Your Google Meet link arrives instantly.",
        "Add the session to your calendar and plan to join five minutes early so you're settled before we begin.",
      ],
      "We look forward to hosting you.",
    ],
  },
  {
    n: 28,
    key: "e28-evening-reminder",
    dayOffset: 13,
    time: "14:00",
    angle: "See you tomorrow, add it to your calendar",
    subject: "See you tomorrow morning: here's how to join",
    previewText:
      "Your link is in your Luma confirmation. Doors open a few minutes before 10:00 AM.",
    signoff: "Best regards,",
    blocks: [
      "We're looking forward to hosting you tomorrow morning. A few housekeeping notes so everything goes smoothly:",
      [
        'Your Google Meet link is in your Luma registration confirmation email. Search your inbox for "Luma" if you can\'t find it.',
        "We open the room a few minutes before 10:00 AM; joining early guarantees you a smooth start.",
        "Bring your questions, and your ICT coordinator or science lead if they're free.",
      ],
      "Not registered yet? There's still time.",
      "See you at 10:00 AM tomorrow.",
    ],
  },
  {
    n: 29,
    key: "e29-today",
    dayOffset: 14,
    time: "07:30",
    angle: "Today is the day",
    subject: "Today at 10:00 AM: Blue Sands K12 AR Pedia Demo Live",
    previewText: "The demo is this morning. Your link is one click away.",
    signoff: "Best regards,",
    blocks: [
      "Today's the day.",
      "At 10:00 AM this morning, we'll take you inside Blue Sands K12 AR Pedia: live augmented reality lessons, virtual experiments, teacher dashboards, and open Q&A.",
      "If you've registered, your Google Meet link is in your Luma confirmation email. If you haven't, there's still time.",
      "We recommend joining a few minutes early.",
    ],
  },
  {
    n: 30,
    key: "e30-starting-soon",
    dayOffset: 14,
    time: "09:15",
    angle: "Starting soon, we go live in 45 minutes",
    subject: "Starting soon: we go live in 45 minutes",
    previewText:
      "Grab your link, grab your questions, see you at 10:00 AM sharp.",
    signoff: "See you at 10:00,",
    blocks: [
      "We go live in under an hour.",
      "If you've been meaning to join, this is the moment. Get your link ready and settle in. The demonstration begins at 10:00 AM sharp, and we'll go straight into the augmented reality experience.",
      "Not yet registered? One click fixes that.",
      "Already registered? Your Google Meet link is in your Luma confirmation. See you shortly.",
    ],
  },
];

export function findCampaignEmail(key) {
  return CAMPAIGN_SEQUENCE.find((e) => e.key === key) || null;
}

// Lightweight fields for the admin UI (no HTML bodies shipped to the client).
export function sequenceSummary() {
  return CAMPAIGN_SEQUENCE.map(
    ({ n, key, angle, subject, previewText, dayOffset, time }) => ({
      n,
      key,
      angle,
      subject,
      previewText,
      dayOffset,
      time,
    }),
  );
}

// A paragraph, or a bullet list rendered as a table so spacing and the branded
// marker survive Outlook and other strict clients.
function renderBlock(block) {
  if (Array.isArray(block)) {
    const items = block
      .map(
        (li) => `
        <tr>
          <td valign="top" style="padding:0 10px 10px 0;color:${BLUE};font-size:16px;line-height:1.6;font-family:${FONT}">&bull;</td>
          <td valign="top" style="padding:0 0 10px 0;color:${INK};font-size:15px;line-height:1.6;font-family:${FONT}">${li}</td>
        </tr>`,
      )
      .join("");
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px"><tbody>${items}</tbody></table>`;
  }
  return `<p style="margin:0 0 16px;color:${INK};font-size:15px;line-height:1.7;font-family:${FONT}">${block}</p>`;
}

// Outlook-safe "bulletproof" button: VML for MSO, a padded anchor everywhere else.
function button(url, label) {
  return `
  <!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:46px;v-text-anchor:middle;width:200px;" arcsize="18%" strokecolor="${BLUE}" fillcolor="${BLUE}">
    <w:anchorlock/>
    <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${label}</center>
  </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-->
  <a href="${url}" style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:15px;font-family:${FONT}">${label}</a>
  <!--<![endif]-->`;
}

// Full, standards-based HTML email: table layout, inline styles, hidden
// preheader, a responsive tweak for mobile, and the Resend unsubscribe merge
// tag so broadcasts get working one-click unsubscribe.
export function renderCampaignEmail(email, opts = {}) {
  const eventLong = longDate(opts.eventDateISO || EVENT_DATE);
  const register = opts.registerUrl || REGISTER_URL;
  const address = opts.senderAddress || SENDER_ADDRESS;
  const preheader = email.previewText || "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${email.subject}</title>
  <!--[if mso]><style>table,td,div,p,a{font-family:Arial,sans-serif !important}</style><![endif]-->
  <style>
    body,table,td,p,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img{ border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
    body{ margin:0; padding:0; width:100% !important; background:#eef2f6; }
    a{ color:${BLUE}; }
    @media only screen and (max-width:600px){
      .container{ width:100% !important; }
      .px{ padding-left:24px !important; padding-right:24px !important; }
      .py{ padding-top:28px !important; padding-bottom:28px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#eef2f6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#eef2f6;font-size:1px;line-height:1px">${preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#eef2f6;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:${NAVY};padding:32px 40px;" class="px">
              <img src="${LOGO_URL}" width="52" height="52" alt="Blue Sands STEM Labs" style="display:block;border-radius:12px;margin:0 auto 14px;">
              <div style="color:#ffffff;font-family:${FONT};font-size:20px;font-weight:800;letter-spacing:-0.2px">Blue Sands K12 AR Pedia</div>
              <div style="color:rgba(255,255,255,0.65);font-family:${FONT};font-size:13px;margin-top:6px">Demo Live &nbsp;&middot;&nbsp; ${eventLong}</div>
            </td>
          </tr>
          <tr><td style="height:4px;background:${BLUE};font-size:0;line-height:0">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td class="px py" style="padding:36px 40px 8px;">
              <p style="margin:0 0 18px;color:${NAVY};font-size:16px;font-weight:bold;font-family:${FONT}">${email.greeting || "Dear Educator,"}</p>
              ${email.blocks.map(renderBlock).join("")}
            </td>
          </tr>

          <!-- Event / CTA -->
          <tr>
            <td class="px" style="padding:8px 40px 4px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f1f6fc;border:1px solid #dbeafe;border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 6px;color:${NAVY};font-size:14px;font-family:${FONT}"><strong>Date:</strong> ${eventLong}</p>
                    <p style="margin:0 0 6px;color:${NAVY};font-size:14px;font-family:${FONT}"><strong>Time:</strong> ${EVENT_TIME_LABEL}</p>
                    <p style="margin:0 0 18px;color:${NAVY};font-size:14px;font-family:${FONT}"><strong>Platform:</strong> Google Meet, your joining link is sent once you register.</p>
                    ${button(register, "Register free")}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td class="px" style="padding:24px 40px 32px;">
              <p style="margin:0 0 4px;color:${INK};font-size:15px;font-family:${FONT}">${email.signoff || "Warm regards,"}</p>
              <p style="margin:0;color:${NAVY};font-size:15px;font-weight:bold;font-family:${FONT}">The Blue Sands STEM Labs Team</p>
              <p style="margin:10px 0 0;color:#64748b;font-size:13px;font-style:italic;font-family:${FONT}">Blue Sands K12 AR Pedia, bringing STEM to life, one classroom at a time.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;line-height:1.6;font-family:${FONT}">${address}</p>
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;font-family:${FONT}">
                You are receiving this because your school was invited to the AR Pedia demo.<br>
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#64748b;text-decoration:underline">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
