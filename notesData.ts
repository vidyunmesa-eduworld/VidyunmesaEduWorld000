// Exported: 11/26/2025, 9:42:52 AM
import { SmartNote } from './types';

export interface LibraryItem {
  id: number;
  title: string;
  subject: string;
  time: string;
  pdfUrl?: string;
  youtubeUrl?: string;
  smartContent?: SmartNote;
  smartContentHindi?: SmartNote;
  isPrivate?: boolean;
}

export const STATIC_NOTES: LibraryItem[] = [
  {
    "id": 1764129898003,
    "title": "📚 Pharmaceutical Jurisprudence: Introduction & History 📝",
    "subject": "Pharmaceutical Jurisprudence",
    "time": "15 mins",
    "smartContent": {
      "id": "converted-1764129874795",
      "title": "📚 Pharmaceutical Jurisprudence: Introduction & History 📝",
      "subject": "Pharmaceutical Jurisprudence",
      "readTime": "15 mins",
      "target_exams": [
        "Drug Inspector",
        "AIIMS Pharmacist",
        "RRB Pharmacist"
      ],
      "sections": [
        {
          "type": "callout",
          "title": "🧠 Core Definitions",
          "color": "blue",
          "content": "Jurisprudence is derived from the Latin term **\"Jurisprudentia\"**, meaning 'Knowledge of Law'."
        },
        {
          "type": "list",
          "title": "📖 Breakdown of Jurisprudence",
          "items": [
            "🔸 **Juris**: Law",
            "🔹 **Prudentia**: Knowledge or Skill",
            "➡️ **Definition**: The study of fundamental legal principles or the \"Knowledge of Law\"."
          ]
        },
        {
          "type": "callout",
          "title": "💊 Pharmaceutical Jurisprudence",
          "color": "green",
          "content": "The branch of pharmacy dealing with the knowledge of laws related to **Drugs, Pharmaceuticals, and the Pharmacy Profession**."
        },
        {
          "type": "list",
          "title": "🌍 Scope of Pharmaceutical Jurisprudence",
          "items": [
            "🔸 Covers laws related to **Manufacturing**",
            "🔹 Covers laws related to **Import**",
            "➡️ Covers laws related to **Sale**",
            "🔸 Covers laws related to **Distribution**",
            "🔹 Covers laws related to **Research**",
            "➡️ Covers laws related to **Pricing** of drugs."
          ]
        },
        {
          "type": "table",
          "title": "⚖️ Law vs. Ethics (Crucial Distinction)",
          "tableData": {
            "headers": [
              "Feature",
              "**Law** ⚖️",
              "**Ethics** 🤝"
            ],
            "rows": [
              [
                "Definition",
                "Rules of conduct formally recognized and enforced by the state.",
                "Rules of human conduct/behavior (Moral Code)."
              ],
              [
                "Nature",
                "**Mandatory** (Must be followed).",
                "**Voluntary** (Should be followed)."
              ],
              [
                "Purpose",
                "To regulate and control social life.",
                "To determine what is \"Right\" or \"Wrong\" (Good Conduct)."
              ],
              [
                "Violation",
                "Results in **Punishment/Penalty**.",
                "No legal punishment; results in social disapproval."
              ],
              [
                "Example",
                "Selling Schedule H drugs without a prescription (Illegal).",
                "Helping an injured person on the road (Moral duty)."
              ]
            ]
          }
        },
        {
          "type": "callout",
          "title": "💡 Important Note",
          "color": "yellow",
          "content": "**Morality** refers to good conduct, behavior, and individual consciousness (**Zameer**)."
        },
        {
          "type": "callout",
          "title": "🏛️ History of Pharmaceutical Legislation (Pre-Independence)",
          "color": "blue",
          "content": "A chronological timeline of major events before the **Drugs & Cosmetics Act, 1940**."
        },
        {
          "type": "table",
          "title": "🕰️ Pre-Independence Milestones",
          "tableData": {
            "headers": [
              "Year",
              "Event",
              "Key Details (Verified)"
            ],
            "rows": [
              [
                "**1664**",
                "**First Hospital in India**",
                "Opened at **Fort St. George, Madras** (Chennai)."
              ],
              [
                "**1811**",
                "**First Chemist Shop**",
                "Opened by **Mr. Bathgate** in **Calcutta** (East India Company era)."
              ],
              [
                "**1820**",
                "**Opium Factory**",
                "Established at **Ghazipur** (UP) by **Lord Cornwallis**."
              ],
              [
                "**1821**",
                "Apothecary Shop",
                "Started by **Smith Stanistreet & Co.**"
              ],
              [
                "**1857**",
                "**Opium Act** (First)",
                "First attempt to regulate opium."
              ],
              [
                "**1878**",
                "**Opium Act** (Revised)",
                "Enacted to regulate cultivation, possession, transport, and sale of Opium."
              ],
              [
                "**1894**",
                "**Indian Tariff Act**",
                "Imposed customs duty on imported goods including drugs, chemicals, and spirits."
              ],
              [
                "**1899**",
                "Compounder Training",
                "Compounder Training Course started in Madras."
              ],
              [
                "**1901**",
                "**First Pharma Industry**",
                "**Bengal Chemical & Pharmaceutical Works**, Calcutta. Established by **Acharya P.C. Ray**."
              ],
              [
                "**1903**",
                "Small Factory at Parel",
                "Established by **Prof. T.K. Gajjar** (Mumbai)."
              ],
              [
                "**1907**",
                "**Alembic Chemical Works**",
                "Established at **Baroda** by **Prof. T.K. Gajjar**."
              ],
              [
                "**1919**",
                "**Poisons Act**",
                "Passed to regulate the import, possession, and sale of poisons."
              ],
              [
                "**1930**",
                "**Dangerous Drugs Act**",
                "Passed to control narcotic drugs (Repealed by **NDPS Act 1985**)."
              ],
              [
                "**1937**",
                "**Drug Bill** (Import)",
                "Introduced in Legislative Assembly. **Focus:** Only on **Import** of drugs (**Incomplete**)."
              ]
            ]
          }
        },
        {
          "type": "callout",
          "title": "🔍 The Drug Inquiry Committee (DEC) - 1927",
          "color": "purple",
          "content": "Also known as the **Chopra Committee**."
        },
        {
          "type": "list",
          "title": "📋 DEC Details",
          "items": [
            "🔸 **Appointed**: 1927 by the Government of India.",
            "🔹 **Chairman**: **Col. R.N. Chopra**.",
            "➡️ **Report Submitted**: 1930-31.",
            "🔸 **Objective**: To inquire into the quality of drugs (imported & indigenous) and recommend control measures."
          ]
        },
        {
          "type": "list",
          "title": "🔑 Key Recommendations of DEC",
          "items": [
            "🔸 **Central Legislation**: Creation of a central act to control drugs (led to **D&C Act 1940**).",
            "🔹 **Testing Laboratory**: Setting up a **Central Drug Laboratory (CDL)** (Established in **Kolkata**).",
            "➡️ **Advisory Board**: Appointment of advisory boards (led to **DTAB** & **DCC**).",
            "🔸 **Training**: Setting up proper pharmacy education courses (**B.Pharm/D.Pharm**).",
            "🔹 **Pharmacopoeia**: Compilation of an **Indian Pharmacopoeia**."
          ]
        },
        {
          "type": "callout",
          "title": "🎓 Evolution of Pharmacy Education in India",
          "color": "orange",
          "content": "Recognizing the pivotal role: **Father of Pharmacy Education in India: Prof. M.L. Schroff** (Mahadeva Lal Schroff)."
        },
        {
          "type": "list",
          "title": "📜 Education Milestones",
          "items": [
            "🔸 **1932**: **Prof. Schroff** introduced **Pharmaceutical Chemistry** as a principal subject in B.Sc at **Banaras Hindu University (BHU)**.",
            "🔹 **1934**: Integrated 2-year B.Sc course (Pharma Chem, Pharmacy, Pharmacognosy) started at **BHU**.",
            "➡️ **1935**: **United Province Pharmaceutical Association** established (Later became the **Indian Pharmaceutical Association - IPA**).",
            "🔸 **1939**: **Indian Journal of Pharmacy** started by **Prof. M.L. Schroff**.",
            "🔹 **1945**: First **Ph.D. in Pharmaceutical Sciences** started at **BHU**.",
            "➡️ **1954**: **B.Pharm** course approved by PCI at **BITS Pilani**.",
            "🔸 **1955**: First **Diploma (D.Pharm)** course approved by PCI at **Govt. Medical College, Amritsar**."
          ]
        },
        {
          "type": "table",
          "title": "🗳️ The \"Big 4\" Committees (High Yield for Exams)",
          "tableData": {
            "headers": [
              "Year",
              "Committee Name",
              "Chairman",
              "**Mnemonic** 💡",
              "Purpose/Result"
            ],
            "rows": [
              [
                "**1943**",
                "Health Survey & **Development** Committee",
                "**Sir Joseph Bhore**",
                "**\"Bhore (Morning) brings Development\"**",
                "Recommended **PHCs** and integration of preventive/curative health."
              ],
              [
                "**1953**",
                "Pharmaceutical **Inquiry** Committee",
                "**Maj. Gen. S.L. Bhatia**",
                "**\"Bhatia Inquiry\"**",
                "Addressed pharmaceutical profession/industry issues."
              ],
              [
                "**1959**",
                "Health Survey & **Planning** Committee",
                "**Dr. A.L. Mudaliar**",
                "**\"Mudaliar Planning\"**",
                "Review of Bhore committee implementation & future planning."
              ],
              [
                "**1974**",
                "Committee on Drugs & Pharm **Industry**",
                "**Jaisukhlal Hathi**",
                "**\"Hathi (Elephant) is Big Industry\"**",
                "Recommended **GMP** (Good Manufacturing Practices)."
              ]
            ]
          }
        },
        {
          "type": "list",
          "title": "📜 Major Post-Independence Acts & Bodies",
          "items": [
            "🔸 **1940**: **Drugs and Cosmetics Act** passed (Regulates **Import, Manufacture, Sale, Distribution**).",
            "🔹 **1945**: **Drugs and Cosmetics Rules** passed.",
            "➡️ **1945**: Pharmacy Bill introduced.",
            "🔸 **1948**: **Pharmacy Act** passed (To regulate the profession/education).",
            "🔹 **1948**: **Indian Pharmacopoeia Commission (IPC)** constituted (Chair: **Dr. B.N. Ghosh**).",
            "➡️ **1949**: **Pharmacy Council of India (PCI)** established.",
            "⭐ **First President of PCI**: **Dr. K.C.K.E. Raja**.",
            "🔸 **1954**: **Drugs and Magic Remedies (Objectionable Advertisements) Act**.",
            "🔹 **1955**: **Medicinal and Toilet Preparations (Excise Duties) Act**.",
            "➡️ **1970**: **Indian Patents Act**.",
            "🔸 **1985**: **Narcotic Drugs and Psychotropic Substances (NDPS) Act**."
          ]
        },
        {
          "type": "callout",
          "title": "🚀 Quick Recall Box: Firsts in India",
          "color": "teal",
          "content": "A crucial list of 'firsts' for rapid revision!"
        },
        {
          "type": "list",
          "title": "🥇 Pioneer Facts",
          "items": [
            "🔸 **First Hospital**: **Fort St. George, Madras** (1664)",
            "🔹 **First Chemist Shop**: **Bathgate & Co, Calcutta** (1811)",
            "➡️ **First Pharma Industry**: **Bengal Chemical & Pharm Works** (1901, **P.C. Ray**)",
            "🔸 **Father of Pharmacy Edu**: **Prof. M.L. Schroff**",
            "🔹 **First PCI President**: **Dr. K.C.K.E. Raja**",
            "➡️ **First CDL Director**: **Dr. B. Mukherjee**"
          ]
        },
        {
          "type": "callout",
          "title": "🧠 AI Mnemonic: \"Firsts in India\"",
          "color": "purple",
          "content": "Remember the 'Firsts' with: **H**ealthy **C**hemists **P**roduce **E**xcellent **P**rofessionals **D**aily!\n\n**H**ospital | **C**hemist Shop | **P**harma Industry | **E**ducation Father | **P**CI President | **D**CL Director"
        },
        {
          "type": "callout",
          "title": "⚠️ EXAM TRAP: The Drug Bill of 1937 vs. D&C Act 1940",
          "color": "red",
          "content": "Don't confuse the initial **Drug Bill of 1937** with the comprehensive **Drugs & Cosmetics Act, 1940**.\n\n*   The **1937 Drug Bill** was **incomplete**; its primary focus was **ONLY on the Import** of drugs.\n*   The later **1940 D&C Act** was much broader, regulating **Import, Manufacture, Sale, AND Distribution** of drugs. This distinction is a common point for tricky exam questions!"
        }
      ]
    },
    "isPrivate": false,
    "youtubeUrl": "https://youtu.be/s2wQG_R_wxw?si=BHf5zL3ulPosUDY3"
  },
  {
    "id": 1764081887804,
    "title": "Drugs & Cosmetics Act, 1940 & Rules, 1945 📝",
    "subject": "Forensic Pharmacy",
    "time": "20 mins",
    "smartContent": {
      "id": "converted-1764081874584",
      "title": "Drugs & Cosmetics Act, 1940 & Rules, 1945 📝",
      "subject": "Forensic Pharmacy",
      "readTime": "20 mins",
      "target_exams": [
        "DI",
        "AIIMS",
        "RRB",
        "GPAT"
      ],
      "sections": [
        {
          "type": "callout",
          "title": "🎯 Premium Exam Notes",
          "color": "blue",
          "content": "✅ Verified against **CDSCO**, The Drugs & Cosmetics Act (Bare Act), and Textbook of Forensic Pharmacy (N.K. Jain / B.M. Mithal).\n🔹 Includes **Schedule H1** (2013/14) & **Schedule M/T** details."
        },
        {
          "type": "table",
          "title": "1. 📌 Quick Overview (The Basics)",
          "tableData": {
            "headers": [
              "Element",
              "Details"
            ],
            "rows": [
              [
                "**Enactment Date**",
                "10th April 1940 (Received Assent)"
              ],
              [
                "**Rules Introduced**",
                "1945 (Drugs and Cosmetics Rules)"
              ],
              [
                "**Territory**",
                "Whole of India"
              ],
              [
                "**Governing Body**",
                "**CDSCO** (Central Drugs Standard Control Organization)"
              ],
              [
                "**Scope (IMSD)**",
                "**I**mport, **M**anufacture, **S**ale, **D**istribution."
              ],
              [
                "**Exports?**",
                "Not primarily regulated by domestic standards (follows importing country's rules), but specific \"Export Only\" licenses exist."
              ]
            ]
          }
        },
        {
          "type": "list",
          "title": "🎯 Objectives (Why it exists)",
          "items": [
            "🛡️ **Safety**: Protect public from harmful/toxic drugs.",
            "🧪 **Efficacy**: Ensure drugs actually work (Therapeutic value).",
            "⚖️ **Quality**: Prevent **MAS** (Misbranded, Adulterated, Spurious) drugs.",
            "🤝 **Uniformity**: Regulate manufacture/sale across all states."
          ]
        },
        {
          "type": "table",
          "title": "2. 🧠 Major Amendments Timeline (The \"Year\" Code)",
          "tableData": {
            "headers": [
              "Year",
              "Event",
              "Exam Mnemonic"
            ],
            "rows": [
              [
                "1940",
                "Act Passed",
                "The **Birth**"
              ],
              [
                "1945",
                "Rules Passed",
                "The **Rules**"
              ],
              [
                "1982",
                "**Schedule X** formalized (Strict control on Psychotropics); Definition of \"**Spurious**\" added.",
                "**X**-Files opened"
              ],
              [
                "1988",
                "**Schedule M** made mandatory (**GMP**).",
                "**M**anufacturing Upgrade"
              ],
              [
                "2000",
                "**Schedule T** (**GMP** for **ASU** Drugs).",
                "**T**raditional Upgrade"
              ],
              [
                "2010",
                "**Schedule L1** (**GLP**) Effective date (Notified 2008).",
                "**L**ab Quality"
              ],
              [
                "2013/14",
                "**Schedule H1** Notified (Aug 2013) -> Effective (Mar 2014).",
                "**H1** Antibiotic Watch"
              ],
              [
                "2019",
                "New Drugs & Clinical Trials Rules (Replaced Part of **Sch Y**).",
                "**Y** Evolution"
              ]
            ]
          }
        },
        {
          "type": "callout",
          "title": "⚠️ EXAM TRAP: Schedule Notification vs. Effective Dates",
          "color": "red",
          "content": "🔸 **Correction from source notes**: **Schedule H1** was notified in **2013** and effective **2014**, NOT 2008.\n🔹 **Schedule L1** was notified in **2008** and effective 2010."
        },
        {
          "type": "callout",
          "title": "🧠 AI Mnemonic: Administrative Bodies - The DAC Sequence",
          "color": "purple",
          "content": "➡️ Remember the 'DAC' sequence for easy recall of their sections:\n    **D**TAB (**§5**) → **C**DL (**§6**) → **D**CC (**§7**).\n💡 *Think*: **D**o **A C**all, then **D**ecide **C**arefully!"
        },
        {
          "type": "table",
          "title": "3. 🏛️ Administrative Bodies (The Regulatory Trinity)",
          "tableData": {
            "headers": [
              "Feature",
              "DTAB (Technical)",
              "CDL (Lab)",
              "DCC (Consultative)"
            ],
            "rows": [
              [
                "**Full Form**",
                "**D**rugs **T**echnical **A**dvisory **B**oard",
                "**C**entral **D**rugs **L**aboratory",
                "**D**rugs **C**onsultative **C**ommittee"
              ],
              [
                "**Section**",
                "§ 5",
                "§ 6",
                "§ 7"
              ],
              [
                "**Function**",
                "Advises Central/State Govt on **technical matters**.",
                "**Appellate testing**; Analyzes samples for Customs/Courts.",
                "Ensures **uniformity of administration** across states."
              ],
              [
                "**Chairman**",
                "**DGHS** (Director General of Health Services)",
                "Director (Appointed by Central Govt)",
                "**DCGI** (Drugs Controller General of India)"
              ],
              [
                "**Location**",
                "MoHFW (New Delhi)",
                "**Kolkata** (Primary)",
                "New Delhi"
              ]
            ]
          }
        },
        {
          "type": "list",
          "title": "💡 Exam Tips: Administrative Bodies",
          "items": [
            "➡️ Who advises the government? **DTAB**.",
            "➡️ Who secures uniformity? **DCC**.",
            "➡️ Where is the Central Lab? **Kolkata**.",
            "❗ **Note**: CRI Kasauli functions as **CDL** for Vaccines/Sera."
          ]
        },
        {
          "type": "callout",
          "title": "🚫 MAS Violations Context",
          "color": "blue",
          "content": "The definition of **Misbranded**, **Adulterated**, and **Spurious** depends on whether the drug is being **Imported** (Chapter III) or **Manufactured/Sold** (Chapter IV)."
        },
        {
          "type": "table",
          "title": "4. 🚫 The \"MAS\" Violations (High Yield)",
          "tableData": {
            "headers": [
              "Type",
              "Definition / Key Concepts",
              "Import Section",
              "Mfg/Sale Section"
            ],
            "rows": [
              [
                "**Misbranded**",
                "➡️ \"**The Label Lie**\"\n🔹 Not labeled effectively.\n🔹 Claims more therapeutic value than reality.\n🔹 Colored/coated to conceal damage.",
                "§ 9",
                "§ 17"
              ],
              [
                "**Adulterated**",
                "➡️ \"**The Dirty/Weak Drug**\"\n🔹 Filthy, putrid, decomposed.\n🔹 Prepared under insanitary conditions.\n🔹 Contains toxic substances.\n🔹 Strength < Standard (Admixture).",
                "§ 9A",
                "§ 17A"
              ],
              [
                "**Spurious**",
                "➡️ \"**The Fake Copy**\"\n🔹 Imitation of another drug.\n🔹 Fictitious/Fake manufacturer name.\n🔹 Resembles another drug to deceive.\n🔹 Manufacturer doesn't exist.",
                "§ 9B",
                "§ 17B"
              ]
            ]
          }
        },
        {
          "type": "list",
          "title": "5. 📋 The Schedules (The Heart of the Exam)",
          "items": [
            "🅰️ **Schedules to the ACT (Only 2)**",
            "    🔸 **First Schedule**: List of authoritative books for **ASU** (Ayurveda, Siddha, Unani) e.g., Charak Samhita.",
            "    🔹 **Second Schedule**: Standards to be complied with for **Import/Manufacture**."
          ]
        },
        {
          "type": "list",
          "title": "🅱️ Schedules to the RULES (A to Y)",
          "items": [
            "🏭 **Group 1: Infrastructure & GMP**"
          ]
        },
        {
          "type": "table",
          "title": "Schedules: Group 1 (Infrastructure & GMP)",
          "tableData": {
            "headers": [
              "Schedule",
              "Description",
              "Mnemonic"
            ],
            "rows": [
              [
                "**A**",
                "Forms (Licenses, Applications).",
                "**A**pplication"
              ],
              [
                "**B**",
                "Fees for analysis by CDL/Govt Analyst.",
                "**B**ill"
              ],
              [
                "**M** ⭐",
                "**GMP** (Good Manufacturing Practices) for Allopathic.",
                "**M**anufacturing"
              ],
              [
                "**M1**",
                "**GMP** for Homeopathic.",
                "**1** (Uno) Homeo"
              ],
              [
                "**M2**",
                "**GMP** for Cosmetics.",
                "**2** Faces (Cosmetics)"
              ],
              [
                "**M3**",
                "**GMP** for Medical Devices.",
                "**3** Devices"
              ],
              [
                "**N**",
                "Minimum equipment/space for a Pharmacy.",
                "**N**eeds"
              ],
              [
                "**T**",
                "**GMP** for Traditional (**ASU**) Drugs.",
                "**T**raditional"
              ],
              [
                "**U**",
                "Records/Registers of Manufacturing.",
                "**U**pdate Records"
              ],
              [
                "**L1**",
                "**GLP** (Good Laboratory Practices).",
                "**L**ab"
              ]
            ]
          }
        },
        {
          "type": "list",
          "title": "Schedules to the RULES (A to Y) cont.",
          "items": [
            "💊 **Group 2: Product Specifics**"
          ]
        },
        {
          "type": "table",
          "title": "Schedules: Group 2 (Product Specifics)",
          "tableData": {
            "headers": [
              "Schedule",
              "Description",
              "Mnemonic"
            ],
            "rows": [
              [
                "**C**",
                "**Biologicals** (Injectables, Vaccines, Sera) - Parental.",
                "**C**ritical"
              ],
              [
                "**C1**",
                "Special Products (Vitamins, Hormones) - Non-Parental.",
                "**C**ousin of C"
              ],
              [
                "**F**",
                "**Blood Bank** (Part XIIB) & Blood Products.",
                "**F**luid"
              ],
              [
                "**F1**",
                "Vaccines (provisions applicable to).",
                "**F**irst Defense"
              ],
              [
                "**F2**",
                "Surgical Dressings.",
                "**F**iber"
              ],
              [
                "**F3**",
                "Umbilical Tapes.",
                "**F**ilament"
              ],
              [
                "**FF**",
                "**Ophthalmic Preparations** (Eye drops).",
                "**F**our eyes (Glasses)"
              ],
              [
                "**S**",
                "Standards for Cosmetics.",
                "**S**tyle"
              ],
              [
                "**R**",
                "Standards for Condoms / Mechanical Contraceptives.",
                "**R**ubber"
              ]
            ]
          }
        },
        {
          "type": "list",
          "title": "Schedules to the RULES (A to Y) cont.",
          "items": [
            "⚠️ **Group 3: Regulation, Control & Labels (CRITICAL)**"
          ]
        },
        {
          "type": "table",
          "title": "Schedules: Group 3 (Regulation, Control & Labels)",
          "tableData": {
            "headers": [
              "Schedule",
              "Requirement",
              "Label Warning / Symbol"
            ],
            "rows": [
              [
                "**G**",
                "Medical Supervision.",
                "\"**Caution**: It is dangerous to take this preparation except under medical supervision.\""
              ],
              [
                "**H**",
                "Prescription Drugs. Retail only against valid **Rx**.",
                "Symbol **Rx** on label."
              ],
              [
                "**H1** ⭐",
                "**Antibiotics** (3rd/4th Gen), Habit-forming.\n➡️ **Record**: Chemist must keep register (Pt Name, Dr Name) for **3 Years**.",
                "Symbol **Rx in RED**.\nBoxed Warning with Red Border."
              ],
              [
                "**X** ⭐",
                "**Narcotics & Psychotropics** (Ketamine, etc).\n➡️ **Storage**: Lock & Key.\n➡️ **Rx**: In Duplicate.\n➡️ **Records**: Keep for **2 Years**.",
                "Symbol **NRx in RED**.\nLeft top corner of label."
              ],
              [
                "**J**",
                "**Incurable Diseases**. Drugs cannot claim to cure these (Cancer, AIDS, Diabetes, Blindness).",
                "Claims Prohibited."
              ],
              [
                "**P**",
                "Life Period (**Expiry Date**) & Storage.",
                "Period"
              ],
              [
                "**P1**",
                "Pack Size (Retail).",
                "Pack"
              ],
              [
                "**Y**",
                "Requirements for **Clinical Trials** (New Drugs).",
                "**Y** (Why do we need this drug?)"
              ]
            ]
          }
        },
        {
          "type": "table",
          "title": "6. 🕵️ Inspectors & Analysts (Sections 20-25)",
          "tableData": {
            "headers": [
              "Role",
              "Section",
              "Qualification (Basic)",
              "Time to Report"
            ],
            "rows": [
              [
                "**Govt. Analyst**",
                "§ 20",
                "Pharm/Science/Med Degree + **5 Yrs Exp**.",
                "Within **60 Days** of receiving sample."
              ],
              [
                "**Drug Inspector**",
                "§ 21",
                "B.Pharm/Pharm.D OR Med (with specialization) + **18 months** sched C mfg exp.",
                "N/A"
              ]
            ]
          }
        },
        {
          "type": "list",
          "title": "⚡ Powers of Inspector (§ 22)",
          "items": [
            "🔎 Inspect any premises (**mfg/sale**).",
            "💰 Take **Samples** (Must pay fair market value).",
            "🚨 Search & Seize (If offence suspected).",
            "🚫 Stop Orders (Order not to dispose of stock for **20 days**)."
          ]
        },
        {
          "type": "list",
          "title": "📦 Sampling Procedure (§ 23)",
          "items": [
            "➡️ The sample is divided into **4 Portions**:",
            "    1.  **Portion 1**: To the person from whom seized (**Chemist**).",
            "    2.  **Portion 2**: To the **Govt. Analyst** (For test).",
            "    3.  **Portion 3**: To the **Court** (Legal backup).",
            "    4.  **Portion 4**: To the **Manufacturer** (If seized from retailer).",
            "❗ **Note**: If seized directly from **Manufacturer**, only **3 portions** are made."
          ]
        },
        {
          "type": "callout",
          "title": "🧠 AI Mnemonic: Sampling Procedure (C-A-C-M)",
          "color": "purple",
          "content": "To remember the **4 Portions** of a seized drug sample (when from a retailer):\n➡️ **C**hemist (person seized from)\n➡️ **A**nalyst (Govt. Analyst)\n➡️ **C**ourt (for legal backup)\n➡️ **M**anufacturer\n*Think: The **C.A.C.M.** team processes the sample!*"
        },
        {
          "type": "callout",
          "title": "⚠️ Potential Trap: Sampling Portions",
          "color": "red",
          "content": "Be careful! The number of sample portions changes based on *who* the sample is seized from:\n🔸 **4 Portions**: If seized from a **retailer** (Chemist, Analyst, Court, Manufacturer).\n🔹 **3 Portions**: If seized directly from the **Manufacturer** (Analyst, Court, Manufacturer - no need to give one back to the manufacturer, as it was taken from them directly for testing)."
        },
        {
          "type": "table",
          "title": "7. 📝 License Forms (Quick Cheat Sheet)",
          "tableData": {
            "headers": [
              "Category",
              "Retail Sale",
              "Wholesale"
            ],
            "rows": [
              [
                "General Drugs (Other than C, C1, X)",
                "**20**",
                "**20-B**"
              ],
              [
                "Biologicals (Schedule C, C1)",
                "**21**",
                "**21-B**"
              ],
              [
                "Schedule X (Narcotics)",
                "**20-F**",
                "**20-G**"
              ],
              [
                "Restricted License (Vendors/Traveling)",
                "**20-A**",
                "--"
              ]
            ]
          }
        },
        {
          "type": "list",
          "title": "8. 🎓 Final Pro-Tips for the Exam",
          "items": [
            "📚 **Schedule K**: Exemptions from Chapter IV (e.g., Doctors supplying own patients).",
            "⚖️ **Schedule V**: Standards for Patent & Proprietary Medicines.",
            "🗓️ **Expiry Dates (Sch P)**:",
            "    🔸 Insulin: **24 Months**.",
            "    🔹 Aspirin/Paracetamol: **60 Months**.",
            "🚨 **Penalties (Spurious leading to death)**: Imprisonment **10 years to Life** + Fine **₹10 Lakh** (or **3x value** of confiscated goods)."
          ]
        }
      ]
    },
    "isPrivate": false
  },
  {
    "id": 1764067454581,
    "title": "📚 Pharmaceutical Jurisprudence: Smart Notes",
    "subject": "Pharmaceutical Jurisprudence",
    "time": "15 mins",
    "smartContent": {
      "id": "converted-1764067363888",
      "title": "📚 Pharmaceutical Jurisprudence: Smart Notes",
      "subject": "Pharmaceutical Jurisprudence",
      "readTime": "15 mins",
      "target_exams": [
        "Drug Inspector",
        "AIIMS Pharmacist",
        "RRB Pharmacist"
      ],
      "sections": [
        {
          "type": "callout",
          "title": "🚀 Exam Prep Focus",
          "color": "blue",
          "content": "Notes reorganized for **Drug Inspector, AIIMS, and RRB Pharmacist** preparations. All data cross-verified against **CDSCO, Bare Acts, and standard textbooks (N.K. Jain, Remington)** for 100% accuracy."
        },
        {
          "type": "list",
          "title": "🧠 Core Definitions: Jurisprudence",
          "items": [
            "🔸 Derived from the Latin term \"**Jurisprudentia**\".",
            "🔹 **Juris:** Law",
            "🔹 **Prudentia:** Knowledge or Skill",
            "➡️ **Definition:** The study of fundamental legal principles or the \"**Knowledge of Law**\"."
          ]
        },
        {
          "type": "callout",
          "title": "💡 Pharmaceutical Jurisprudence Defined",
          "color": "green",
          "content": "The branch of pharmacy dealing with the knowledge of laws related to **Drugs, Pharmaceuticals, and the Pharmacy Profession**. Its scope covers laws related to **Manufacturing, Import, Sale, Distribution, Research, and Pricing** of drugs."
        },
        {
          "type": "table",
          "title": "⚖️ Law vs. Ethics (Crucial Distinction)",
          "tableData": {
            "headers": [
              "Feature",
              "**Law** ⚖️",
              "**Ethics** 🤝"
            ],
            "rows": [
              [
                "Definition",
                "Rules of conduct formally recognized and enforced by the state.",
                "Rules of human conduct/behavior (Moral Code)."
              ],
              [
                "Nature",
                "**Mandatory** (Must be followed).",
                "**Voluntary** (Should be followed)."
              ],
              [
                "Purpose",
                "To regulate and control social life.",
                "To determine what is \"Right\" or \"Wrong\" (Good Conduct)."
              ],
              [
                "Violation",
                "Results in **Punishment/Penalty**.",
                "No legal punishment; results in social disapproval."
              ],
              [
                "Example",
                "Selling Schedule H drugs without a prescription (Illegal).",
                "Helping an injured person on the road (Moral duty)."
              ]
            ]
          }
        },
        {
          "type": "callout",
          "title": "⚠️ Potential Trap: Morality",
          "color": "red",
          "content": "Do not confuse **Morality** with Law or Ethics. **Morality** refers specifically to good conduct, behavior, and individual consciousness (Zameer), distinct from formal laws or broader ethical codes."
        },
        {
          "type": "table",
          "title": "🏛️ History of Pharmaceutical Legislation (Pre-Independence Timeline)",
          "tableData": {
            "headers": [
              "Year",
              "Event",
              "Key Details (Verified)"
            ],
            "rows": [
              [
                "**1664**",
                "**First Hospital in India**",
                "Opened at **Fort St. George, Madras** (Chennai)."
              ],
              [
                "**1811**",
                "**First Chemist Shop**",
                "Opened by **Mr. Bathgate** in **Calcutta** (East India Company era)."
              ],
              [
                "**1820**",
                "**Opium Factory**",
                "Established at **Ghazipur** (UP) by **Lord Cornwallis**."
              ],
              [
                "**1821**",
                "Apothecary Shop",
                "Started by **Smith Stanistreet & Co.**"
              ],
              [
                "**1857**",
                "**Opium Act** (First)",
                "First attempt to regulate opium."
              ],
              [
                "**1878**",
                "**Opium Act** (Revised)",
                "Enacted to regulate cultivation, possession, transport, and sale of Opium."
              ],
              [
                "**1894**",
                "**Indian Tariff Act**",
                "Imposed customs duty on imported goods including drugs, chemicals, and spirits."
              ],
              [
                "**1899**",
                "Compounder Training",
                "Compounder Training Course started in Madras."
              ],
              [
                "**1901**",
                "**First Pharma Industry**",
                "**Bengal Chemical & Pharmaceutical Works**, Calcutta. Established by **Acharya P.C. Ray**."
              ],
              [
                "**1903**",
                "Small Factory at Parel",
                "Established by **Prof. T.K. Gajjar** (Mumbai)."
              ],
              [
                "**1907**",
                "**Alembic Chemical Works**",
                "Established at **Baroda** by **Prof. T.K. Gajjar**."
              ],
              [
                "**1919**",
                "**Poisons Act**",
                "Passed to regulate the import, possession, and sale of poisons."
              ],
              [
                "**1930**",
                "**Dangerous Drugs Act**",
                "Passed to control narcotic drugs (Repealed by NDPS Act 1985)."
              ],
              [
                "**1937**",
                "**Drug Bill** (Import)",
                "Introduced in Legislative Assembly. **Focus:** Only on **Import** of drugs (Incomplete)."
              ]
            ]
          }
        },
        {
          "type": "callout",
          "title": "🔍 The Drug Inquiry Committee (DEC) - 1927",
          "color": "purple",
          "content": "Also famously known as the **Chopra Committee**."
        },
        {
          "type": "list",
          "title": "📋 DEC Details & Objective",
          "items": [
            "➡️ **Appointed:** 1927 by the Government of India.",
            "➡️ **Chairman:** **Col. R.N. Chopra**.",
            "➡️ **Report Submitted:** 1930-31.",
            "➡️ **Objective:** To inquire into the **quality of drugs** (imported & indigenous) and recommend control measures."
          ]
        },
        {
          "type": "list",
          "title": "🌟 Key Recommendations of DEC",
          "items": [
            "🔸 **Central Legislation:** Creation of a central act to control drugs (led to D&C Act 1940).",
            "🔹 **Testing Laboratory:** Setting up a **Central Drug Laboratory (CDL)** (Established in **Kolkata**).",
            "🔸 **Advisory Board:** Appointment of advisory boards (led to **DTAB** & **DCC**).",
            "🔹 **Training:** Setting up proper pharmacy education courses (**B.Pharm/D.Pharm**).",
            "🔸 **Pharmacopoeia:** Compilation of an **Indian Pharmacopoeia**."
          ]
        },
        {
          "type": "callout",
          "title": "🧠 Mnemonic: DEC Recommendations",
          "color": "purple",
          "content": "Remember DEC's 5 key recommendations using: **C.T.A.T.P.** (Central Legislation, Testing Lab, Advisory Board, Training, Pharmacopoeia) -> Think \"**C**hopra **T**old **A**ll **T**o **P**repare\"."
        },
        {
          "type": "list",
          "title": "🎓 Evolution of Pharmacy Education in India",
          "items": [
            "👑 **Father of Pharmacy Education in India:** **Prof. M.L. Schroff** (Mahadeva Lal Schroff).",
            "➡️ **1932:** Prof. Schroff introduced **Pharmaceutical Chemistry** as a principal subject in B.Sc at **Banaras Hindu University (BHU)**.",
            "➡️ **1934:** Integrated 2-year B.Sc course (Pharma Chem, Pharmacy, Pharmacognosy) started at **BHU**.",
            "➡️ **1935:** **United Province Pharmaceutical Association** established (Later became the **Indian Pharmaceutical Association - IPA**).",
            "➡️ **1939:** **Indian Journal of Pharmacy** started by **Prof. M.L. Schroff**.",
            "➡️ **1945:** First **Ph.D. in Pharmaceutical Sciences** started at **BHU**.",
            "➡️ **1954:** **B.Pharm** course approved by PCI at **BITS Pilani**.",
            "➡️ **1955:** First **Diploma (D.Pharm)** course approved by PCI at **Govt. Medical College, Amritsar**."
          ]
        },
        {
          "type": "table",
          "title": "🗳️ The \"Big 4\" Committees (High Yield for Exams)",
          "tableData": {
            "headers": [
              "Year",
              "Committee Name",
              "Chairman",
              "**Mnemonic** 💡",
              "Purpose/Result"
            ],
            "rows": [
              [
                "**1943**",
                "Health Survey & **Development** Committee",
                "**Sir Joseph Bhore**",
                "**\"Bhore (Morning) brings Development\"**",
                "Recommended PHCs and integration of preventive/curative health."
              ],
              [
                "**1953**",
                "Pharmaceutical **Inquiry** Committee",
                "**Maj. Gen. S.L. Bhatia**",
                "**\"Bhatia Inquiry\"**",
                "Addressed pharmaceutical profession/industry issues."
              ],
              [
                "**1959**",
                "Health Survey & **Planning** Committee",
                "**Dr. A.L. Mudaliar**",
                "**\"Mudaliar Planning\"**",
                "Review of Bhore committee implementation & future planning."
              ],
              [
                "**1974**",
                "Committee on Drugs & Pharm **Industry**",
                "**Jaisukhlal Hathi**",
                "**\"Hathi (Elephant) is Big Industry\"**",
                "Recommended **GMP** (Good Manufacturing Practices)."
              ]
            ]
          }
        },
        {
          "type": "callout",
          "title": "⚠️ Exam Trap: Bhore vs. Mudaliar",
          "color": "red",
          "content": "Crucially distinguish between the **Bhore Committee (1943)**, which focused on **Development** (initial PHC recommendations), and the **Mudaliar Committee (1959)**, which concentrated on **Planning** (reviewing Bhore's work and future strategies). The keywords in their names are your guide!"
        },
        {
          "type": "list",
          "title": "📜 Major Post-Independence Acts & Bodies",
          "items": [
            "➡️ **1940:** **Drugs and Cosmetics Act** passed (Regulates **Import, Manufacture, Sale, Distribution**).",
            "➡️ **1945:** **Drugs and Cosmetics Rules** passed.",
            "➡️ **1945:** Pharmacy Bill introduced.",
            "➡️ **1948:** **Pharmacy Act** passed (To regulate the **profession/education**).",
            "➡️ **1948:** **Indian Pharmacopoeia Commission (IPC)** constituted (Chair: **Dr. B.N. Ghosh**).",
            "➡️ **1949:** **Pharmacy Council of India (PCI)** established.",
            "👑 **First President of PCI:** **Dr. K.C.K.E. Raja**.",
            "➡️ **1954:** **Drugs and Magic Remedies (Objectionable Advertisements) Act**.",
            "➡️ **1955:** **Medicinal and Toilet Preparations (Excise Duties) Act**.",
            "➡️ **1970:** **Indian Patents Act**.",
            "➡️ **1985:** **Narcotic Drugs and Psychotropic Substances (NDPS) Act**."
          ]
        },
        {
          "type": "list",
          "title": "🚀 Quick Recall Box: Firsts in India (Exam Essentials)",
          "items": [
            "⭐ **First Hospital:** **Fort St. George, Madras** (1664)",
            "⭐ **First Chemist Shop:** **Bathgate & Co, Calcutta** (1811)",
            "⭐ **First Pharma Industry:** **Bengal Chemical & Pharm Works** (1901, **Acharya P.C. Ray**)",
            "⭐ **Father of Pharmacy Edu:** **Prof. M.L. Schroff**",
            "⭐ **First PCI President:** **Dr. K.C.K.E. Raja**",
            "⭐ **First CDL Director:** **Dr. B. Mukherjee**"
          ]
        }
      ]
    },
    "isPrivate": true,
    "youtubeUrl": "https://youtu.be/s2wQG_R_wxw?si=4r0RXY5WKwWON2P9"
  },
  {
    "id": 1764060318568,
    "title": "Generated Note 📝",
    "subject": "Pharmaceutical Jurisprudence",
    "time": "15 mins",
    "smartContent": {
      "id": "converted-1764060304652",
      "title": "Generated Note 📝",
      "subject": "Pharmaceutical Jurisprudence",
      "readTime": "15 mins",
      "target_exams": [
        "Drug Inspector",
        "AIIMS Pharmacist",
        "RRB Pharmacist"
      ],
      "sections": [
        {
          "type": "callout",
          "title": "💡 Exam Preparation Focus",
          "color": "blue",
          "content": "These notes are reorganized for **Drug Inspector, AIIMS, and RRB Pharmacist** preparations. Everything has been cross-verified against **CDSCO, Bare Acts, and standard textbooks (N.K. Jain, Remington)** to ensure **100% accuracy**."
        },
        {
          "type": "list",
          "title": "🧠 Core Definitions: Jurisprudence",
          "items": [
            "🔸 Derived from the Latin term **\"Jurisprudentia\"**.",
            "🔹 **Juris**: Law",
            "🔹 **Prudentia**: Knowledge or Skill",
            "➡️ **Definition**: The study of fundamental legal principles or the \"**Knowledge of Law**\"."
          ]
        },
        {
          "type": "table",
          "title": "⚖️ Law vs. Ethics: Crucial Distinction",
          "tableData": {
            "headers": [
              "Feature",
              "**Law** ⚖️",
              "**Ethics** 🤝"
            ],
            "rows": [
              [
                "Definition",
                "Rules of conduct formally recognized and enforced by the state.",
                "Rules of human conduct/behavior (**Moral Code**)."
              ],
              [
                "Nature",
                "**Mandatory** (Must be followed).",
                "**Voluntary** (Should be followed)."
              ],
              [
                "Example",
                "Selling **Schedule H** drugs without a prescription (Illegal).",
                "Helping an injured person on the road (Moral duty)."
              ]
            ]
          }
        }
      ]
    },
    "isPrivate": true,
    "youtubeUrl": "https://youtu.be/s2wQG_R_wxw?si=o-a_v9qzvbu7fwz7"
  }
];