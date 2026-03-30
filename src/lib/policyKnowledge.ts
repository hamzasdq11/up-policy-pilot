export interface PolicyResponse {
  directAnswer: string;
  strategy: string;
  benefits: string[];
  risks: string[];
  comparison?: string;
}

export interface QuickAction {
  label: string;
  query: string;
  icon: string;
}

export const quickActions: QuickAction[] = [
  { label: "Best Incentive for My Investment", query: "I am investing ₹100 crore in a manufacturing unit in UP. Which incentive option should I choose?", icon: "💰" },
  { label: "MSME Benefits", query: "What benefits do MSMEs get under UP IIEPP 2022?", icon: "🏭" },
  { label: "UP vs Other States", query: "How does UP compare with Gujarat, Tamil Nadu, and Telangana for industrial investment?", icon: "📊" },
  { label: "Risk Assessment", query: "What are the real risks of investing under UP IIEPP 2022?", icon: "⚠️" },
  { label: "Land & Stamp Duty", query: "What land and stamp duty incentives are available under UP IIEPP 2022?", icon: "🏗️" },
  { label: "Export-Oriented Units", query: "What additional benefits do export-oriented units get under the UP policy?", icon: "🌍" },
];

type ResponseKey = 'incentive' | 'msme' | 'comparison' | 'risks' | 'land' | 'export' | 'default';

function classifyQuery(query: string): ResponseKey {
  const q = query.toLowerCase();
  if (q.includes('incentive') || q.includes('option') || q.includes('invest') || q.includes('crore') || q.includes('subsidy') || q.includes('capital')) return 'incentive';
  if (q.includes('msme') || q.includes('small') || q.includes('micro') || q.includes('medium')) return 'msme';
  if (q.includes('compar') || q.includes('gujarat') || q.includes('tamil') || q.includes('telangana') || q.includes('karnataka') || q.includes('better') || q.includes('vs')) return 'comparison';
  if (q.includes('risk') || q.includes('challenge') || q.includes('delay') || q.includes('problem') || q.includes('issue')) return 'risks';
  if (q.includes('land') || q.includes('stamp') || q.includes('duty') || q.includes('plot')) return 'land';
  if (q.includes('export') || q.includes('international') || q.includes('global')) return 'export';
  return 'default';
}

const responses: Record<ResponseKey, PolicyResponse> = {
  incentive: {
    directAnswer: "Under UP IIEPP 2022, you have **3 incentive options** (choose one):\n\n**Option 1 – Capital Subsidy:** Direct subsidy on Fixed Capital Investment (FCI). Best for capital-heavy projects.\n\n**Option 2 – SGST Reimbursement:** Net SGST paid on goods manufactured & sold within UP is reimbursed. Best if your primary market is UP/domestic.\n\n**Option 3 – PLI Top-up:** Additional 1–5% top-up over GOI's PLI incentive. Only for PLI-eligible sectors (electronics, pharma, auto components, etc.).",
    strategy: "**For ₹100 Cr+ manufacturing investment:**\n- If your project is **capital-intensive** (heavy machinery, plant setup) → **Choose Option 1 (Capital Subsidy)** — direct cash benefit on FCI.\n- If you're selling **within UP** (FMCG, consumer goods, cement) → **Choose Option 2 (SGST Reimbursement)** — can yield higher returns over the incentive period.\n- If you're in a **PLI-notified sector** → **Choose Option 3** — stack GOI PLI + state top-up for maximum benefit.\n\n**Mega projects (₹500 Cr+)** get enhanced rates and longer incentive periods. Apply for Mega Project status via Nivesh Mitra.",
    benefits: [
      "Capital Subsidy: 15–25% of FCI depending on category & zone",
      "SGST Reimbursement: Up to 100% net SGST for 10–15 years",
      "Employment Linked Booster: Additional 1% subsidy per 100 direct jobs (capped)",
      "Export Booster: Extra incentive for 25%+ export revenue",
      "Stamp duty: 100% exemption in priority sectors/zones",
      "Land subsidy: Up to 50–75% in Bundelkhand/Poorvanchal regions",
    ],
    risks: [
      "Subsidy disbursal can take 12–24 months after eligible claim submission",
      "No statutory guarantee — incentives are policy-based, not law-backed (unlike Telangana TS-iPASS)",
      "Documentation and compliance requirements are extensive — engage a CA firm early",
      "Policy valid until 2027 — projects started late may not get full benefit tenure",
    ],
    comparison: "**Gujarat:** Simpler process, faster disbursal, stronger industrial ecosystem, but lower subsidy rates.\n**Tamil Nadu:** Excellent for auto & electronics, comparable incentives, better port access.\n**UP Advantage:** Highest population = largest domestic market; land costs 40–60% lower; labor availability unmatched."
  },
  msme: {
    directAnswer: "MSMEs receive **significant preferential treatment** under UP IIEPP 2022. The policy categorizes MSMEs per MSME Development Act and offers higher subsidy rates compared to large industries in many zones.\n\n**Key MSME thresholds:**\n- Micro: Investment up to ₹1 Cr, turnover up to ₹5 Cr\n- Small: Investment up to ₹10 Cr, turnover up to ₹50 Cr\n- Medium: Investment up to ₹50 Cr, turnover up to ₹250 Cr",
    strategy: "**Best strategy for MSMEs:**\n1. **Register on Nivesh Mitra** portal immediately — it's mandatory for all incentive claims\n2. **Choose Option 1 (Capital Subsidy)** in most cases — MSMEs get higher % rates\n3. **Locate in Bundelkhand/Poorvanchal** for maximum subsidy (up to 25% FCI)\n4. **Hire locally** — employment-linked booster adds 1% additional subsidy per 100 UP-domiciled jobs\n5. **Apply for ODOP (One District One Product)** alignment for additional state support",
    benefits: [
      "Higher capital subsidy rates than large industries (up to 25% FCI in priority zones)",
      "100% stamp duty exemption on first unit in many zones",
      "Interest subsidy on term loans (5% for 5 years in select zones)",
      "Quality certification reimbursement (ISO, BIS, ZED up to ₹2 lakh)",
      "Patent filing cost reimbursement up to ₹10 lakh",
      "MSME cluster development support",
      "Priority allotment in industrial parks",
    ],
    risks: [
      "MSMEs often lack awareness of available incentives — only ~15% of eligible units claim benefits",
      "Documentation burden disproportionately affects smaller units",
      "Subsidy disbursal delays can cause cash flow stress for MSMEs",
      "Single-window system (Nivesh Mitra) still has inefficiencies for smaller applications",
    ],
    comparison: "**Telangana TS-iPASS:** Legally guaranteed approval timelines — better for MSMEs needing certainty.\n**Karnataka:** Strong startup/MSME ecosystem with dedicated MSME parks.\n**UP Advantage:** Lower labor & land costs; massive local consumer market; ODOP integration."
  },
  comparison: {
    directAnswer: "Here's how UP stacks up against key competing states:\n\n| Parameter | UP (IIEPP 2022) | Gujarat | Tamil Nadu | Telangana |\n|-----------|----------------|---------|------------|----------|\n| Capital Subsidy | 15–25% FCI | 12–20% FCI | 15–30% FCI | 15–25% FCI |\n| SGST Reimbursement | Up to 100% | Up to 100% | Up to 100% | Up to 100% |\n| Approval System | Nivesh Mitra (Single Window) | iPortal (Mature) | Single Window | TS-iPASS (Statutory) |\n| Land Cost | ₹3–15 lakh/acre | ₹10–40 lakh/acre | ₹8–30 lakh/acre | ₹5–25 lakh/acre |\n| Labor Availability | Highest in India | Moderate | Good (skilled) | Moderate |\n| Ease of Business | Improving rapidly | Best in class | Very good | Excellent |\n| Legal Guarantee | No (Policy-based) | No | No | Yes (TS-iPASS Act) |",
    strategy: "**Choose UP if:**\n- Your project needs large labor force (textiles, food processing, assembly)\n- You're targeting the North Indian domestic market\n- Land cost is a critical factor\n- You're in ODOP-aligned sectors\n\n**Choose Gujarat if:** You need mature infrastructure, port access, and fastest approvals.\n**Choose Tamil Nadu if:** Auto, electronics, or heavy engineering with export focus.\n**Choose Telangana if:** You need legally guaranteed timelines and are in IT/pharma.",
    benefits: [
      "UP has India's largest domestic consumer market (230M+ population)",
      "Land costs 40–70% lower than Gujarat/Tamil Nadu in many districts",
      "Expressway network (Purvanchal, Bundelkhand, Ganga) improving logistics rapidly",
      "Dedicated defense corridor (Jhansi-Chitrakoot-Lucknow-Kanpur-Agra-Aligarh)",
      "2 international airports under development (Jewar, Ayodhya)",
    ],
    risks: [
      "Ease of doing business still lags Gujarat and Telangana in practice",
      "Industrial infrastructure gaps in Tier-3 districts",
      "Power reliability inconsistent in some zones despite tariff subsidies",
      "Bureaucratic culture slower to change compared to southern states",
    ],
  },
  risks: {
    directAnswer: "The UP IIEPP 2022 is a strong policy on paper, but ground-level execution has **real challenges** that investors must plan for:\n\n**Top 5 Risks:**\n1. **Subsidy Disbursal Delays** — Claims can take 12–24 months; budget allocation constraints\n2. **No Statutory Backing** — Unlike Telangana's TS-iPASS, UP incentives are policy-based and can change\n3. **Bureaucratic Friction** — Despite Nivesh Mitra, clearances from multiple departments still required\n4. **Land Acquisition** — Title disputes, conversion delays, encroachment issues in some areas\n5. **Policy Continuity Risk** — Policy valid until 2027; new government may modify terms",
    strategy: "**Risk Mitigation Playbook:**\n1. **Get everything in writing** — Secure a formal Entitlement Certificate before commencing\n2. **Hire a local compliance firm** — Navigate district-level approvals efficiently\n3. **Start documentation from Day 1** — Maintain CA-certified records for all eligible expenses\n4. **Choose established industrial zones** — UPSIDC/GNIDA plots have cleaner titles\n5. **Maintain relationships** — Regular engagement with District Industries Centre (DIC) officials\n6. **Consider phased investment** — Don't deploy 100% capital before first subsidy cycle clears",
    benefits: [
      "Despite risks, UP offers the highest ROI potential due to low input costs",
      "Nivesh Mitra digitization is reducing some process delays",
      "CM-level monitoring of mega projects provides faster escalation",
      "UP government's political will for industrialization is currently very strong",
    ],
    risks: [
      "No legal recourse if subsidy is delayed or denied — only administrative remedies",
      "Environmental clearances (pollution board) can add 3–6 months",
      "Labor law compliance still complex despite reforms",
      "GST reconciliation issues for SGST reimbursement claims",
      "Power infrastructure in remote areas may need captive backup",
    ],
  },
  land: {
    directAnswer: "**Land & Stamp Duty incentives under UP IIEPP 2022:**\n\n**Stamp Duty:**\n- 100% exemption on purchase/lease of land for industrial use in Bundelkhand, Poorvanchal, and other priority zones\n- 50–75% exemption in other zones depending on sector and investment size\n- Applies to first transaction for setting up new industrial unit\n\n**Land Subsidy:**\n- Up to 50–75% subsidy on land cost in Bundelkhand and Poorvanchal regions\n- Subsidized plots in UPSIDC industrial areas\n- Plug-and-play infrastructure in select industrial parks",
    strategy: "**Best approach for land:**\n1. **Target UPSIDC/state industrial development authority plots** — pre-approved zoning, cleaner titles\n2. **Bundelkhand corridor** offers maximum land benefits + defense corridor adjacency\n3. **Avoid private land acquisition** initially — title verification and conversion adds 6–12 months\n4. **Check if your sector qualifies for 100% stamp duty exemption** — saves 5–7% of land cost upfront",
    benefits: [
      "100% stamp duty exemption in priority zones",
      "Land at subsidized rates in UPSIDC industrial areas",
      "Plug-and-play flatted factories for MSMEs in select locations",
      "Priority allotment for mega projects",
      "Long-term lease options (90 years) in industrial corridors",
    ],
    risks: [
      "Land title disputes are common in rural UP — always do independent title search",
      "Agricultural land conversion (NA permission) can take 3–6 months",
      "Some UPSIDC plots lack promised infrastructure (roads, water, power)",
      "Encroachment issues in select industrial areas",
    ],
  },
  export: {
    directAnswer: "**Export-oriented units get additional boosters under UP IIEPP 2022:**\n\n- **Export Revenue Booster:** Additional 1–2% incentive on capital subsidy if 25%+ revenue from exports\n- **SGST Reimbursement benefit:** Export units generating domestic B2B sales in UP also qualify\n- **Priority sector treatment** for export-intensive sectors\n- **Logistics support:** Proximity to upcoming Jewar International Airport and dedicated freight corridors",
    strategy: "**For export-focused units:**\n1. **Choose Option 1 (Capital Subsidy) + Export Booster** — combined benefit is highest\n2. **Locate near Noida/Greater Noida** for Jewar airport proximity or **Varanasi** for eastern corridor\n3. **Register under SEZ/FTWZ** if applicable — stack central + state benefits\n4. **Target 25%+ export ratio** to activate the Export Booster addon\n5. **Consider Free Trade Warehousing Zones** for duty-free import of raw materials",
    benefits: [
      "Export Booster: Additional 1–2% on base capital subsidy",
      "Access to Dedicated Freight Corridor (DFC) — faster logistics to ports",
      "Jewar International Airport (upcoming) — air cargo hub for North India",
      "SEZ/FTWZ benefits stackable with state incentives in many cases",
      "Trade facilitation support through UP Export Promotion Bureau",
    ],
    risks: [
      "UP is landlocked — port access adds logistics cost vs. Gujarat/Tamil Nadu",
      "Jewar airport still under construction — full cargo operations 2025–26",
      "DFC connectivity to many UP industrial zones still in progress",
      "Export documentation support ecosystem less mature than coastal states",
    ],
    comparison: "**Gujarat:** Direct port access (Mundra, Kandla) — clear advantage for exports.\n**Tamil Nadu:** Chennai port + auto export hub — better for manufactured exports.\n**UP Opportunity:** Jewar airport + DFC can transform UP into a North Indian export hub by 2026–27. Early movers benefit most."
  },
  default: {
    directAnswer: "The **UP Industrial Investment & Employment Promotion Policy 2022 (UP IIEPP 2022)** is Uttar Pradesh's flagship industrial policy designed to attract investment, boost manufacturing, and create employment.\n\n**Key Highlights:**\n- Valid: 2022–2027\n- 3 incentive options (Capital Subsidy / SGST Reimbursement / PLI Top-up)\n- Performance-linked boosters (employment, export, ecosystem)\n- Special zones: Bundelkhand, Poorvanchal, defense corridor\n- Single-window clearance via Nivesh Mitra portal",
    strategy: "To give you the **best strategic advice**, I need:\n1. **Investment amount** (helps classify: MSME / Large / Mega)\n2. **Sector** (manufacturing, IT, food processing, textiles, etc.)\n3. **Preferred location** in UP\n4. **Export orientation** (domestic vs export focus)\n\nShare these details and I'll recommend the optimal incentive option with a detailed benefit calculation.",
    benefits: [
      "Capital Subsidy up to 25% of FCI",
      "100% SGST reimbursement for up to 15 years",
      "PLI top-up for eligible sectors",
      "Employment-linked additional subsidies",
      "Land at subsidized rates in priority zones",
      "100% stamp duty exemption in select zones",
      "R&D and patent filing support",
    ],
    risks: [
      "Policy-based incentives (not statutory) — subject to government discretion",
      "Implementation maturity varies by district",
      "Subsidy disbursal timelines can be unpredictable",
    ],
  },
};

export function getResponse(query: string): PolicyResponse {
  const key = classifyQuery(query);
  return responses[key];
}
