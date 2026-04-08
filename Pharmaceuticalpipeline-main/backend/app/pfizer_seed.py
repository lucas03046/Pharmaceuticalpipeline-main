from __future__ import annotations

from .company_reports import PipelineProgram, PipelineReport, ingest_pipeline_report


PFIZER_PIPELINE_PDF_URL = "https://cdn.pfizer.com/pfizercom/product-pipeline/Q4%202025%20Pipeline%20Update_vFinal3.pdf"
PFIZER_PIPELINE_SNAPSHOT_DATE = "2026-02-03"


def p(
    name: str,
    molecule: str,
    modality: str,
    therapy_area: str,
    indication: str,
    phase: str,
    source_detail: str,
    *,
    start_date: str | None = "2026-02-03",
    nct_number: str | None = None,
) -> PipelineProgram:
    return PipelineProgram(
        name=name,
        molecule=molecule,
        modality=modality,
        therapy_area=therapy_area,
        indication=indication,
        phase=phase,
        status="Active",
        source_detail=source_detail,
        start_date=start_date,
        nct_number=nct_number,
    )


PFIZER_PROGRAMS: list[PipelineProgram] = [
    p("HYMPAVZI (marstacimab)", "Anti-tissue factor pathway inhibitor", "Biologic", "Inflammation and Immunology", "Hemophilia (inhibitor cohort)", "Filing", "Pfizer pipeline PDF lists marstacimab in registration for hemophilia inhibitor cohort."),
    p("LITFULO (ritlecitinib)", "JAK3/TEC inhibitor", "Small Molecule", "Inflammation and Immunology", "Vitiligo", "Phase 3", "Pfizer pipeline PDF lists ritlecitinib in Phase 3 for vitiligo."),
    p("dazukibart (PF-06823859)", "anti-IFN-beta", "Biologic", "Inflammation and Immunology", "Dermatomyositis, Polymyositis", "Phase 3", "Pfizer pipeline PDF lists dazukibart in Phase 3 for dermatomyositis and polymyositis."),
    p("HYMPAVZI (marstacimab)", "Anti-tissue factor pathway inhibitor", "Biologic", "Inflammation and Immunology", "Hemophilia (Pediatric: inhibitor and non-inhibitor cohorts)", "Phase 3", "Pfizer pipeline PDF lists marstacimab in Phase 3 for pediatric hemophilia cohorts."),
    p("osivelotor (PF-07940367)", "HbS polymerization inhibitor", "Small Molecule", "Inflammation and Immunology", "Sickle Cell Disease", "Phase 3", "Pfizer pipeline PDF lists osivelotor in Phase 3 for sickle cell disease."),
    p("LITFULO (ritlecitinib)", "JAK3/TEC inhibitor", "Small Molecule", "Inflammation and Immunology", "Ulcerative Colitis", "Phase 2", "Pfizer pipeline PDF lists ritlecitinib in Phase 2 for ulcerative colitis."),
    p("LITFULO (ritlecitinib)", "JAK3/TEC inhibitor", "Small Molecule", "Inflammation and Immunology", "Crohn's Disease", "Phase 2", "Pfizer pipeline PDF lists ritlecitinib in Phase 2 for Crohn's disease."),
    p("LITFULO (ritlecitinib)", "JAK3/TEC inhibitor", "Small Molecule", "Inflammation and Immunology", "Chronic Spontaneous Urticaria", "Phase 2", "Pfizer pipeline PDF lists ritlecitinib in Phase 2 for chronic spontaneous urticaria."),
    p("LITFULO (ritlecitinib)", "JAK3/TEC inhibitor", "Small Molecule", "Inflammation and Immunology", "Hidradenitis Suppurativa", "Phase 2", "Pfizer pipeline PDF lists ritlecitinib in Phase 2 for hidradenitis suppurativa."),
    p("dazukibart (PF-06823859)", "anti-IFN-beta", "Biologic", "Inflammation and Immunology", "Lupus", "Phase 2", "Pfizer pipeline PDF lists dazukibart in Phase 2 for lupus."),
    p("PF-06835375", "anti-CXCR5", "Biologic", "Inflammation and Immunology", "Immune Thrombocytopenic Purpura", "Phase 2", "Pfizer pipeline PDF lists PF-06835375 in Phase 2 for immune thrombocytopenic purpura."),
    p("Tilrekimig", "anti-IL-4/ IL-13/ TSLP", "Biologic", "Inflammation and Immunology", "Atopic Dermatitis", "Phase 2", "Pfizer pipeline PDF lists Tilrekimig in Phase 2 for atopic dermatitis."),
    p("Tilrekimig", "anti-IL-4/ IL-13/ TSLP", "Biologic", "Inflammation and Immunology", "Asthma", "Phase 2", "Pfizer pipeline PDF lists Tilrekimig in Phase 2 for asthma."),
    p("Ompekimig", "anti-IL-4/ IL-13/ IL-33", "Biologic", "Inflammation and Immunology", "Atopic Dermatitis", "Phase 2", "Pfizer pipeline PDF lists Ompekimig in Phase 2 for atopic dermatitis."),
    p("PF-07868489", "anti-BMP9", "Biologic", "Inflammation and Immunology", "Pulmonary Arterial Hypertension", "Phase 2", "Pfizer pipeline PDF lists PF-07868489 in Phase 2 for pulmonary arterial hypertension."),
    p("PF-07261271", "p40/TL1a bispecific", "Biologic", "Inflammation and Immunology", "Inflammatory Bowel Disease", "Phase 2", "Pfizer pipeline PDF lists PF-07261271 in Phase 2 for inflammatory bowel disease."),
    p("Dekavil", "IL-10", "Biologic", "Inflammation and Immunology", "Rheumatoid Arthritis", "Phase 1", "Pfizer pipeline PDF lists Dekavil in Phase 1 for rheumatoid arthritis."),
    p("PF-06835375", "anti-CXCR5", "Biologic", "Inflammation and Immunology", "Lupus", "Phase 1", "Pfizer pipeline PDF lists PF-06835375 in Phase 1 for lupus."),
    p("PF-07905428", "undisclosed", "Small Molecule", "Inflammation and Immunology", "Acne", "Phase 1", "Pfizer pipeline PDF lists PF-07905428 in Phase 1 for acne."),
    p("PF-08049820", "STAT6 inhibitor", "Small Molecule", "Inflammation and Immunology", "Atopic Dermatitis", "Phase 1", "Pfizer pipeline PDF lists PF-08049820 in Phase 1 for atopic dermatitis."),
    p("PF-07832837", "undisclosed", "Biologic", "Inflammation and Immunology", "Atopic Dermatitis", "Phase 1", "Pfizer pipeline PDF lists PF-07832837 in Phase 1 for atopic dermatitis."),
    p("PF-07985631", "undisclosed", "Biologic", "Inflammation and Immunology", "Nephropathy", "Phase 1", "Pfizer pipeline PDF lists PF-07985631 in Phase 1 for nephropathy."),

    p("ibuzatrelvir (PF-07817883)", "SARS-CoV-2 3CL protease inhibitor", "Oral", "Internal Medicine", "COVID-19 Infection", "Phase 3", "Pfizer pipeline PDF lists ibuzatrelvir in Phase 3 for COVID-19 infection."),
    p("NURTEC (rimegepant)", "calcitonin gene-related peptide (CGRP) receptor antagonist", "Small Molecule", "Internal Medicine", "Menstrually-Related Migraine", "Phase 3", "Pfizer pipeline PDF lists NURTEC in Phase 3 for menstrually-related migraine."),
    p("MET-097i (PF-08653944)", "GLP-1 receptor agonist", "Biologic", "Internal Medicine", "Chronic Weight Management", "Phase 3", "Pfizer pipeline PDF lists MET-097i in Phase 3 for chronic weight management."),
    p("ponsegromab (PF-06946860)", "Growth Differentiation Factor 15 (GDF15) monoclonal antibody", "Biologic", "Internal Medicine", "Cachexia in Cancer", "Phase 2", "Pfizer pipeline PDF lists ponsegromab in Phase 2 for cachexia in cancer."),
    p("PF-07976016", "GIPR antagonist", "Small Molecule", "Internal Medicine", "Chronic Weight Management", "Phase 2", "Pfizer pipeline PDF lists PF-07976016 in Phase 2 for chronic weight management."),
    p("PF-07328948", "Branched chain ketoacid dehydrogenase kinase (BDK) inhibitor", "Small Molecule", "Internal Medicine", "Heart Failure", "Phase 2", "Pfizer pipeline PDF lists PF-07328948 in Phase 2 for heart failure."),
    p("MET-097i + MET-233i (PF-08653944 + PF-08653945)", "GLP-1 receptor agonist + DACRA", "Biologic", "Internal Medicine", "Chronic Weight Management", "Phase 2", "Pfizer pipeline PDF lists MET-097i plus MET-233i in Phase 2 for chronic weight management."),
    p("MET-233i (PF-08653945)", "DACRA", "Biologic", "Internal Medicine", "Chronic Weight Management", "Phase 2", "Pfizer pipeline PDF lists MET-233i in Phase 2 for chronic weight management."),
    p("PF-07258669", "Melanocortin-4 receptor (MC4R) antagonist", "Small Molecule", "Internal Medicine", "Malnutrition", "Phase 1", "Pfizer pipeline PDF lists PF-07258669 in Phase 1 for malnutrition."),
    p("PF-07999415", "undisclosed", "Biologic", "Internal Medicine", "Obesity", "Phase 1", "Pfizer pipeline PDF lists PF-07999415 in Phase 1 for obesity."),
    p("MET-034i +/- MET-097i (PF-08654696 +/- PF-08653944)", "GIPR agonist +/- GLP-1 receptor agonist", "Biologic", "Internal Medicine", "Chronic Weight Management", "Phase 1", "Pfizer pipeline PDF lists MET-034i plus or minus MET-097i in Phase 1 for chronic weight management."),
    p("MET-224o (PF-08656796)", "GLP-1 receptor agonist", "Biologic", "Internal Medicine", "Chronic Weight Management", "Phase 1", "Pfizer pipeline PDF lists MET-224o in Phase 1 for chronic weight management."),
    p("MET-815i (PF-08656795)", "GLP-1 receptor agonist", "Biologic", "Internal Medicine", "Chronic Weight Management", "Phase 1", "Pfizer pipeline PDF lists MET-815i in Phase 1 for chronic weight management."),
    p("PF-08642534", "GLP-1 receptor agonist", "Small Molecule", "Internal Medicine", "Chronic Weight Management", "Phase 1", "Pfizer pipeline PDF lists PF-08642534 in Phase 1 for chronic weight management."),

    p("vepdegestrant (ARV-471)", "ER-targeting PROTAC protein degrader", "Small Molecule", "Oncology", "ER+/HER2- Metastatic Breast Cancer ESR1mu (VERITAC 2)", "Filing", "Pfizer pipeline PDF lists vepdegestrant in registration for ESR1-mutant metastatic breast cancer."),
    p("sasanlimab (PF-06801591) + Bacillus Calmette-Guerin (BCG)", "Anti-PD-1", "Biologic", "Oncology", "High-Risk Non-Muscle-Invasive Bladder Cancer (CREST)", "Phase 3", "Pfizer pipeline PDF lists sasanlimab plus BCG in Phase 3 for high-risk non-muscle-invasive bladder cancer."),
    p("IBRANCE (palbociclib)", "CDK4/6 inhibitor", "Small Molecule", "Oncology", "ER+/HER2+ Metastatic Breast Cancer (PATINA)", "Phase 3", "Pfizer pipeline PDF lists IBRANCE in Phase 3 for ER-positive HER2-positive metastatic breast cancer."),
    p("TALZENNA (talazoparib) + XTANDI (enzalutamide)", "PARP inhibitor + androgen receptor inhibitor", "Combination", "Oncology", "DDR-Deficient Metastatic Castration Sensitive Prostate Cancer (TALAPRO-3)", "Phase 3", "Pfizer pipeline PDF lists TALZENNA plus XTANDI in Phase 3 for DDR-deficient metastatic castration-sensitive prostate cancer."),
    p("ELREXFIO (elranatamab-bcmm)", "BCMA-CD3 bispecific antibody", "Biologic", "Oncology", "Relapsed/Refractory Multiple Myeloma Double-Class Exposed (MM-5)", "Phase 3", "Pfizer pipeline PDF lists ELREXFIO in Phase 3 for double-class exposed relapsed or refractory multiple myeloma."),
    p("ELREXFIO (elranatamab-bcmm)", "BCMA-CD3 bispecific antibody", "Biologic", "Oncology", "Newly Diagnosed Multiple Myeloma Post-Transplant Maintenance (MM-7)", "Phase 3", "Pfizer pipeline PDF lists ELREXFIO in Phase 3 for post-transplant maintenance in newly diagnosed multiple myeloma."),
    p("ELREXFIO (elranatamab-bcmm)", "BCMA-CD3 bispecific antibody", "Biologic", "Oncology", "Newly Diagnosed Multiple Myeloma Transplant-Ineligible (MM-6)", "Phase 3", "Pfizer pipeline PDF lists ELREXFIO in Phase 3 for transplant-ineligible newly diagnosed multiple myeloma."),
    p("ELREXFIO (elranatamab-bcmm)", "BCMA-CD3 bispecific antibody", "Biologic", "Oncology", "2L+ post-CD38 Relapsed Refractory Multiple Myeloma (MM-32)", "Phase 3", "Pfizer pipeline PDF lists ELREXFIO in Phase 3 for post-CD38 relapsed refractory multiple myeloma."),
    p("sigvotatug vedotin (PF-08046047)", "Integrin beta-6-directed antibody-drug conjugate", "Biologic", "Oncology", "2L+ Metastatic Non-Small Cell Lung Cancer (Be6A LUNG-01)", "Phase 3", "Pfizer pipeline PDF lists sigvotatug vedotin in Phase 3 for second-line or later metastatic non-small cell lung cancer."),
    p("sigvotatug vedotin (PF-08046047)", "Integrin beta-6-directed antibody-drug conjugate", "Biologic", "Oncology", "1L Metastatic Non-Small Cell Lung Cancer (TPS high) (Be6A LUNG-02)", "Phase 3", "Pfizer pipeline PDF lists sigvotatug vedotin in Phase 3 for first-line high-TPS metastatic non-small cell lung cancer."),
    p("PADCEV (enfortumab vedotin)", "Nectin-4 directed antibody-drug conjugate", "Biologic", "Oncology", "Cisplatin-Eligible Muscle-Invasive Bladder Cancer (EV-304)", "Phase 3", "Pfizer pipeline PDF lists PADCEV in Phase 3 for cisplatin-eligible muscle-invasive bladder cancer."),
    p("TUKYSA (tucatinib)", "HER2 tyrosine kinase inhibitor", "Small Molecule", "Oncology", "HER2+ Adjuvant Breast Cancer (CompassHER2 RD)", "Phase 3", "Pfizer pipeline PDF lists TUKYSA in Phase 3 for adjuvant HER2-positive breast cancer."),
    p("TUKYSA (tucatinib)", "HER2 tyrosine kinase inhibitor", "Small Molecule", "Oncology", "1L HER2+ Maintenance Metastatic Breast Cancer (HER2CLIMB-05)", "Phase 3", "Pfizer pipeline PDF lists TUKYSA in Phase 3 for first-line maintenance HER2-positive metastatic breast cancer."),
    p("TUKYSA (tucatinib)", "HER2 tyrosine kinase inhibitor", "Small Molecule", "Oncology", "1L HER2+ Metastatic Colorectal Cancer (MOUNTAINEER-03)", "Phase 3", "Pfizer pipeline PDF lists TUKYSA in Phase 3 for first-line HER2-positive metastatic colorectal cancer."),
    p("disitamab vedotin (PF-08046051)", "HER2-directed antibody-drug conjugate", "Biologic", "Oncology", "1L HER2 (>=IHC1+) Metastatic Urothelial Cancer (DV-001)", "Phase 3", "Pfizer pipeline PDF lists disitamab vedotin in Phase 3 for first-line HER2-expressing metastatic urothelial cancer."),
    p("mevrometostat (PF-06821497) + enzalutamide", "EZH2 inhibitor + androgen receptor inhibitor", "Combination", "Oncology", "1/2L Metastatic Castration Resistant Prostate Cancer post-Abiraterone (MEVPRO-1)", "Phase 3", "Pfizer pipeline PDF lists mevrometostat plus enzalutamide in Phase 3 for post-abiraterone metastatic castration-resistant prostate cancer."),
    p("mevrometostat (PF-06821497) + enzalutamide", "EZH2 inhibitor + androgen receptor inhibitor", "Combination", "Oncology", "1L Metastatic Castration Resistant Prostate Cancer NHT naive (MEVPRO-2)", "Phase 3", "Pfizer pipeline PDF lists mevrometostat plus enzalutamide in Phase 3 for NHT-naive metastatic castration-resistant prostate cancer."),
    p("mevrometostat (PF-06821497) + enzalutamide", "EZH2 inhibitor + androgen receptor inhibitor", "Combination", "Oncology", "1L Metastatic Castration-Sensitive Prostate Cancer NHT naive (MEVPRO-3)", "Phase 3", "Pfizer pipeline PDF lists mevrometostat plus enzalutamide in Phase 3 for metastatic castration-sensitive prostate cancer."),
    p("atirmociclib (PF-07220060)", "CDK4 inhibitor", "Small Molecule", "Oncology", "1L HR+/HER2- Metastatic Breast Cancer (FourLight-3)", "Phase 3", "Pfizer pipeline PDF lists atirmociclib in Phase 3 for first-line HR-positive HER2-negative metastatic breast cancer."),
    p("prifetrastat (PF-07248144)", "KAT6 epigenetic modifier", "Small Molecule", "Oncology", "2L/3L HR+/HER2- Metastatic Breast Cancer (KATSIS-1)", "Phase 3", "Pfizer pipeline PDF lists prifetrastat in Phase 3 for later-line HR-positive HER2-negative metastatic breast cancer."),
    p("PF-08046054 (PDL1V)", "PD-L1-directed antibody-drug conjugate", "Biologic", "Oncology", "2L+ Non-Small Cell Lung Cancer (PADL1NK-005)", "Phase 3", "Pfizer pipeline PDF lists PF-08046054 in Phase 3 for second-line or later non-small cell lung cancer."),
    p("PF-08634404", "PD-1xVEGF Bispecific Antibody", "Biologic", "Oncology", "1L Metastatic Colorectal Cancer (Symbiotic-GI-03)", "Phase 3", "Pfizer pipeline PDF lists PF-08634404 in Phase 3 for first-line metastatic colorectal cancer."),

    p("maplirpacept (TTI-622)", "CD47-SIRPa fusion protein", "Biologic", "Oncology", "Hematological Malignancies", "Phase 2", "Pfizer pipeline PDF lists maplirpacept in Phase 2 for hematological malignancies."),
    p("PADCEV (enfortumab vedotin)", "Nectin-4 directed antibody-drug conjugate", "Biologic", "Oncology", "Locally Advanced or Metastatic Solid Tumors (EV-202)", "Phase 2", "Pfizer pipeline PDF lists PADCEV in Phase 2 for locally advanced or metastatic solid tumors."),
    p("TIVDAK (tisotumab vedotin)", "Tissue Factor-directed antibody-drug conjugate", "Biologic", "Oncology", "Advanced Solid Tumors (TV-207)", "Phase 2", "Pfizer pipeline PDF lists TIVDAK in Phase 2 for advanced solid tumors."),
    p("TUKYSA (tucatinib)", "HER2 tyrosine kinase inhibitor", "Small Molecule", "Oncology", "2L+ HER2+ Metastatic Breast Cancer (HER2CLIMB-04)", "Phase 2", "Pfizer pipeline PDF lists TUKYSA in Phase 2 for second-line or later HER2-positive metastatic breast cancer."),
    p("TUKYSA (tucatinib)", "HER2 tyrosine kinase inhibitor", "Small Molecule", "Oncology", "Locally Advanced or Metastatic Solid Tumors with HER2 Alterations", "Phase 2", "Pfizer pipeline PDF lists TUKYSA in Phase 2 for HER2-altered advanced or metastatic solid tumors."),
    p("disitamab vedotin", "HER2-directed antibody-drug conjugate", "Biologic", "Oncology", "2L+ Metastatic Urothelial Cancer with HER2 Expression", "Phase 2", "Pfizer pipeline PDF lists disitamab vedotin in Phase 2 for later-line metastatic urothelial cancer with HER2 expression."),
    p("disitamab vedotin", "HER2-directed antibody-drug conjugate", "Biologic", "Oncology", "Locally Advanced or Metastatic Solid Tumors with HER2 Expression", "Phase 2", "Pfizer pipeline PDF lists disitamab vedotin in Phase 2 for advanced or metastatic HER2-expressing solid tumors."),
    p("atirmociclib", "CDK4 inhibitor", "Small Molecule", "Oncology", "2L HR+/HER2- Metastatic Breast Cancer (FourLight-1)", "Phase 2", "Pfizer pipeline PDF lists atirmociclib in Phase 2 for second-line HR-positive HER2-negative metastatic breast cancer."),
    p("atirmociclib", "CDK4 inhibitor", "Small Molecule", "Oncology", "Early Breast Cancer", "Phase 2", "Pfizer pipeline PDF lists atirmociclib in Phase 2 for early breast cancer."),
    p("PF-08634404", "PD-1xVEGF Bispecific Antibody", "Biologic", "Oncology", "1L Non-Small Cell Lung Cancer (squamous)", "Phase 2", "Pfizer pipeline PDF lists PF-08634404 in Phase 2 for first-line squamous non-small cell lung cancer."),
    p("PF-08634404", "PD-1xVEGF Bispecific Antibody", "Biologic", "Oncology", "1L Non-Small Cell Lung Cancer (non-squamous)", "Phase 2", "Pfizer pipeline PDF lists PF-08634404 in Phase 2 for first-line non-squamous non-small cell lung cancer."),

    p("tegtociclib (PF-07104091)", "CDK2 inhibitor", "Small Molecule", "Oncology", "Breast Cancer Metastatic", "Phase 1", "Pfizer pipeline PDF lists tegtociclib in Phase 1 for metastatic breast cancer."),
    p("prifetrastat (PF-07248144)", "KAT6 epigenetic modifier", "Small Molecule", "Oncology", "Breast Cancer Metastatic", "Phase 1", "Pfizer pipeline PDF lists prifetrastat in Phase 1 for metastatic breast cancer."),
    p("tegtociclib (PF-07104091) + atirmociclib", "CDK2 + CDK4 inhibitors", "Combination", "Oncology", "Breast Cancer Metastatic", "Phase 1", "Pfizer pipeline PDF lists tegtociclib plus atirmociclib in Phase 1 for metastatic breast cancer."),
    p("claturafenib (PF-07799933)", "BRAF Class 1 and Class 2 inhibitor", "Small Molecule", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists claturafenib in Phase 1 for advanced solid tumors."),
    p("PF-07799544", "MEK brain penetrant inhibitor", "Small Molecule", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-07799544 in Phase 1 for advanced solid tumors."),
    p("TUKYSA (tucatinib)", "HER2 tyrosine kinase inhibitor", "Small Molecule", "Oncology", "HER2+ Gastrointestinal Cancers (SGNTUC-024)", "Phase 1", "Pfizer pipeline PDF lists TUKYSA in Phase 1 for HER2-positive gastrointestinal cancers."),
    p("PF-06940434", "Integrin alpha-V/beta-8 antagonist", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-06940434 in Phase 1 for advanced solid tumors."),
    p("TIVDAK (tisotumab vedotin)", "Tissue Factor-directed antibody-drug conjugate", "Biologic", "Oncology", "Recurrent or Metastatic Cervical Cancer (TV-205)", "Phase 1", "Pfizer pipeline PDF lists TIVDAK in Phase 1 for recurrent or metastatic cervical cancer."),
    p("PF-08046052 (EGFRd2)", "EGFR-targeted bispecific gamma delta T-cell engager", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08046052 in Phase 1 for advanced solid tumors."),
    p("PF-08046040 (CD70)", "Non-fucosylated CD70-directed antibody", "Biologic", "Oncology", "Myelodysplastic Syndrome and Acute Myeloid Leukemia", "Phase 1", "Pfizer pipeline PDF lists PF-08046040 in Phase 1 for MDS and AML."),
    p("PF-08046050 (CEACAM5C)", "CEACAM5-directed antibody-drug conjugate", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08046050 in Phase 1 for advanced solid tumors."),
    p("sigvotatug vedotin", "Integrin beta-6-directed antibody-drug conjugate", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists sigvotatug vedotin in Phase 1 for advanced solid tumors."),
    p("PF-08046044 (35C)", "CD30-directed antibody TOPO1 drug conjugate", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08046044 in Phase 1 for advanced solid tumors."),
    p("PF-07934040 (KRAS)", "selective KRAS inhibitor", "Small Molecule", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-07934040 in Phase 1 for advanced solid tumors."),
    p("PF-08052666 (MesoC2)", "mesothelin-targeted antibody-drug conjugate", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08052666 in Phase 1 for advanced solid tumors."),
    p("PF-07985045 (KRAS)", "selective KRAS inhibitor", "Small Molecule", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-07985045 in Phase 1 for advanced solid tumors."),
    p("PF-08046031 (CD228V)", "CD228V directed antibody-drug conjugate", "Biologic", "Oncology", "Advanced Melanoma and other Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08046031 in Phase 1 for advanced melanoma and other solid tumors."),
    p("PF-08046037 (PDL1iT)", "Immunostimulatory Drug Conjugate (ISAC) targeted to PD-L1 with a TLR7 agonist payload", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08046037 in Phase 1 for advanced solid tumors."),
    p("PF-08046032 (CD25V)", "CD25V directed antibody-drug conjugate", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08046032 in Phase 1 for advanced solid tumors."),
    p("PF-08046876 (B6C)", "Integrin beta-6-directed antibody-drug conjugate", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08046876 in Phase 1 for advanced solid tumors."),
    p("PF-08052667 (B6N)", "Integrin beta-6-directed antibody-drug conjugate", "Biologic", "Oncology", "Non-muscle Invasive Bladder Cancer", "Phase 1", "Pfizer pipeline PDF lists PF-08052667 in Phase 1 for non-muscle invasive bladder cancer."),
    p("PF-08032560 (KAT6/7)", "Selective inhibitor of epigenetic modifiers KAT6A, KAT6B and KAT7", "Biologic", "Oncology", "Advanced Solid Tumors", "Phase 1", "Pfizer pipeline PDF lists PF-08032560 in Phase 1 for advanced solid tumors."),
    p("PF-08634404", "PD-1xVEGF Bispecific Antibody", "Biologic", "Oncology", "Unresectable Locally Advanced or Metastatic Hepatocellular Carcinoma (Symbiotic-GI-13)", "Phase 1", "Pfizer pipeline PDF lists PF-08634404 in Phase 1 for hepatocellular carcinoma."),

    p("PF-07307405", "Prophylactic vaccine - protein subunit", "Vaccine", "Vaccines", "Lyme Disease", "Phase 3", "Pfizer pipeline PDF lists PF-07307405 in Phase 3 for Lyme disease."),
    p("COVID-19 Vaccine", "Prophylactic vaccine - mRNA", "Vaccine", "Vaccines", "COVID-19 Infection (U.S. - 6 months through 11 years of age)", "Phase 3", "Pfizer pipeline PDF lists the pediatric COVID-19 vaccine in Phase 3."),
    p("PF-06760805", "Prophylactic vaccine - polysaccharide conjugate", "Vaccine", "Vaccines", "Invasive Group B Streptococcus Infection (maternal)", "Phase 3", "Pfizer pipeline PDF lists PF-06760805 in Phase 3 for maternal Group B Streptococcus prevention."),
    p("PF-07831694", "Prophylactic vaccine - protein subunit", "Vaccine", "Vaccines", "Clostridioides difficile (C. difficile) - updated formulation", "Phase 3", "Pfizer pipeline PDF lists PF-07831694 in Phase 3 for C. difficile."),
    p("PF-07252220", "Prophylactic vaccine - mRNA", "Vaccine", "Vaccines", "Influenza (adults)", "Phase 2", "Pfizer pipeline PDF lists PF-07252220 in Phase 2 for adult influenza."),
    p("PF-07872412", "Prophylactic vaccine - polysaccharide conjugate", "Vaccine", "Vaccines", "Pneumococcal Infection", "Phase 2", "Pfizer pipeline PDF lists PF-07872412 in Phase 2 for pneumococcal infection."),
    p("PF-07926307", "Prophylactic vaccine - mRNA", "Vaccine", "Vaccines", "Combination COVID-19 & Influenza", "Phase 2", "Pfizer pipeline PDF lists PF-07926307 in Phase 2 for combination COVID-19 and influenza vaccination."),
    p("PF-07845104", "Prophylactic vaccine - saRNA", "Vaccine", "Vaccines", "Influenza (adults)", "Phase 1", "Pfizer pipeline PDF lists PF-07845104 in Phase 1 for adult influenza."),
    p("ABRYSVO", "Prophylactic vaccine - protein subunit", "Vaccine", "Vaccines", "Respiratory Syncytial Virus Infection (pediatric)", "Phase 1", "Pfizer pipeline PDF lists ABRYSVO in Phase 1 for pediatric RSV."),
    p("PF-07985819", "Prophylactic vaccine - mRNA", "Vaccine", "Vaccines", "Pandemic influenza", "Phase 1", "Pfizer pipeline PDF lists PF-07985819 in Phase 1 for pandemic influenza."),
]


def build_pfizer_report() -> PipelineReport:
    return PipelineReport(
        company_name="Pfizer",
        source_name="Pfizer pipeline PDF",
        source_type="company_pipeline_pdf",
        title="Pfizer Pipeline Update",
        source_url=PFIZER_PIPELINE_PDF_URL,
        snapshot_date=PFIZER_PIPELINE_SNAPSHOT_DATE,
        programs=PFIZER_PROGRAMS,
        metadata={
            "documentLabel": "Q4 2025 Pipeline Update",
            "documentAsOf": "2026-02-03",
            "pipelineSummary": {
                "totalPrograms": 102,
                "phase1": 38,
                "phase2": 30,
                "phase3": 32,
                "registration": 2,
                "nmes": 61,
                "additionalIndications": 41,
                "advancedOrNewSincePreviousUpdate": 15,
                "discontinuedSincePreviousUpdate": 9,
            },
            "conclusions": [
                "Pfizer's published active pipeline spans 102 programs across inflammation and immunology, internal medicine, oncology, and vaccines.",
                "Oncology remains the largest active area with 56 listed programs, including 21 Phase 3 assets and one registration-stage program.",
                "The prior local seed materially underrepresented the report; this parser-ready seed expands coverage to the full active portfolio listed in the PDF and excludes the discontinued section.",
            ],
            "note": "Structured from the February 3, 2026 Pfizer pipeline PDF for local backend ingestion.",
        },
    )


BUILTIN_COMPANY_REPORTS: dict[str, callable] = {
    "pfizer": build_pfizer_report,
}


def list_builtin_company_reports() -> list[str]:
    return sorted(BUILTIN_COMPANY_REPORTS)


def build_builtin_company_report(company_key: str) -> PipelineReport:
    builder = BUILTIN_COMPANY_REPORTS.get(company_key.lower())
    if builder is None:
        available = ", ".join(list_builtin_company_reports())
        raise ValueError(f"Unknown built-in company report '{company_key}'. Available reports: {available}")
    return builder()


def seed_builtin_company_report(company_key: str) -> dict[str, object]:
    return ingest_pipeline_report(build_builtin_company_report(company_key))


def seed_pfizer_pipeline() -> dict[str, object]:
    return seed_builtin_company_report("pfizer")
