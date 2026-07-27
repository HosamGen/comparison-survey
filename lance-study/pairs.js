const PAIRS = [
  {
    "folder": "beautiful_1",
    "metric": "beautiful",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "-23.558177_-46.609469_75_r2_gemini_edit_0_r4_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s1__delta_plus2.270__0003_0.18_sao_paulo_periphery_-23.558177_-46.609469_domain_s1.png"
      }
    ]
  },
  {
    "folder": "beautiful_2",
    "metric": "beautiful",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "40.743684_-74.156777_124_r2_gemini_edit_0_r6_gemini_edit_0_r5_gemini_edit_0_r2_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__adjective_s1__delta_plus2.694__0214_2.39_newark_nj_40.743684_-74.156777_adjective_s1.png"
      }
    ]
  },
  {
    "folder": "beautiful_3",
    "metric": "beautiful",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "4.595769_-74.180653_278_r7_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s1__delta_plus5.954__0019_0.37_bogota_soacha_4.595769_-74.180653_domain_s1.png"
      }
    ]
  },
  {
    "folder": "beautiful_4",
    "metric": "beautiful",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "39.936176_-75.120268_339_r5_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__subject_s0__delta_plus2.784__0217_2.42_camden_nj_39.936176_-75.120268_subject_s0.png"
      }
    ]
  },
  {
    "folder": "beautiful_5",
    "metric": "beautiful",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "50.5288_30.497712_100_r3_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s1__delta_plus5.356__0012_0.30_kyiv_obolon_50.5288_30.497712_domain_s1.png"
      }
    ]
  },
  {
    "folder": "boring_1",
    "metric": "boring",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "42.425756_-82.973148_248_r4_gemini_edit_0_r7_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s1__delta_minus3.826__0232_6.33_detroit_east_42.425756_-82.973148_domain_s1.png"
      }
    ]
  },
  {
    "folder": "boring_2",
    "metric": "boring",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "41.594471_-87.329742_320_r5_gemini_edit_0_r9_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__background_s1__delta_minus6.814__0009_9.06_gary_indiana_41.594471_-87.329742_background_s1.png"
      }
    ]
  },
  {
    "folder": "boring_3",
    "metric": "boring",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "38.658691_-90.216997_1_r1_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__background_s1__delta_minus4.399__0211_6.50_st_louis_north_38.658691_-90.216997_background_s1.png"
      }
    ]
  },
  {
    "folder": "boring_4",
    "metric": "boring",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "-6.123585_106.886498_241_r3_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s1__delta_minus5.300__0203_6.53_jakarta_north_-6.123585_106.886498_domain_s1.png"
      }
    ]
  },
  {
    "folder": "boring_5",
    "metric": "boring",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "42.322905_-83.096148_161_r4_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s1__delta_minus1.712__0234_6.32_detroit_core_42.322905_-83.096148_domain_s1.png"
      }
    ]
  },
  {
    "folder": "depressing_1",
    "metric": "depressing",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "-12.047072_-76.961821_270_r8_gemini_edit_0_r8_gemini_edit_0_r6_gemini_edit_0_r4_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__subject_s1__delta_minus3.502__0017_8.79_lima_periphery_-12.047072_-76.961821_subject_s1.png"
      }
    ]
  },
  {
    "folder": "depressing_2",
    "metric": "depressing",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "-23.500002_-46.684505_151_r2_gemini_edit_0_r6_gemini_edit_0_r11_gemini_edit_0_r6_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__subject_s1__delta_minus4.434__0137_7.05_sao_paulo_periphery_-23.500002_-46.684505_subject_s1.png"
      }
    ]
  },
  {
    "folder": "depressing_3",
    "metric": "depressing",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "14.59923_120.977975_352_r6_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s0__delta_minus5.654__0130_7.16_manila_tondo_14.59923_120.977975_domain_s0.png"
      }
    ]
  },
  {
    "folder": "depressing_4",
    "metric": "depressing",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "33.507486_-111.965869_146_r11_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s1__delta_minus4.674__0011_9.07_phoenix_sprawl_33.507486_-111.965869_domain_s1.png"
      }
    ]
  },
  {
    "folder": "depressing_5",
    "metric": "depressing",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "53.799214_-2.242715_14_r11_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s0__delta_minus6.579__0016_8.79_burnley_uk_53.799214_-2.242715_domain_s0.png"
      }
    ]
  },
  {
    "folder": "lively_1",
    "metric": "lively",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__object_s1__delta_plus2.522__0118_1.65_phoenix_sprawl_33.400036_-112.016993_object_s1.png"
      }
    ]
  },
  {
    "folder": "lively_2",
    "metric": "lively",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "38.655129_-90.219509_145_r2_gemini_edit_0_r8_gemini_edit_0_r2_gemini_edit_0_r5_gemini_edit_0_r3_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__background_s0__delta_minus0.696__0171_2.21_st_louis_north_38.655129_-90.219509_background_s0.png"
      }
    ]
  },
  {
    "folder": "lively_3",
    "metric": "lively",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "33.774327_-84.417054_136_r11_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__background_s1__delta_plus0.422__0304_3.67_atlanta_suburb_33.774327_-84.417054_background_s1.png"
      }
    ]
  },
  {
    "folder": "lively_4",
    "metric": "lively",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "39.28346_-76.631184_91_r11_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__subject_s1__delta_plus1.020__0035_0.61_baltimore_west_39.28346_-76.631184_subject_s1.png"
      }
    ]
  },
  {
    "folder": "lively_5",
    "metric": "lively",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "42.356125_-83.014078_359_r6_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__subject_s1__delta_plus3.539__0020_0.44_detroit_core_42.356125_-83.014078_subject_s1.png"
      }
    ]
  },
  {
    "folder": "safety_1",
    "metric": "safe",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "43.018458_-83.695301_78_r10_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s0__delta_plus3.271__0240_2.96_flint_michigan_43.018458_-83.695301_domain_s0.png"
      }
    ]
  },
  {
    "folder": "safety_2",
    "metric": "safe",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "39.305922_-76.63757_136_r6_gemini_edit_0_r5_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__subject_s1__delta_plus1.720__0376_4.85_baltimore_west_39.305922_-76.63757_subject_s1.png"
      }
    ]
  },
  {
    "folder": "safety_3",
    "metric": "safe",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "19.351811_-99.072415_39_r4_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__background_s1__delta_plus3.767__0081_1.18_mexico_city_iztapalapa_19.351811_-99.072415_background_s1.png"
      }
    ]
  },
  {
    "folder": "safety_4",
    "metric": "safe",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "4.593231_-74.198277_323_r9_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__adjective_s0__delta_plus3.617__0147_1.84_bogota_soacha_4.593231_-74.198277_adjective_s0.png"
      }
    ]
  },
  {
    "folder": "safety_5",
    "metric": "safe",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "43.028216_-83.68338_247_r9_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s0__delta_plus2.116__0082_1.19_flint_michigan_43.028216_-83.68338_domain_s0.png"
      }
    ]
  },
  {
    "folder": "wealthy_1",
    "metric": "wealthy",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "19.34552_-99.072885_29_r10_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__domain_s1__delta_plus4.337__0018_0.57_mexico_city_iztapalapa_19.34552_-99.072885_domain_s1.png"
      }
    ]
  },
  {
    "folder": "wealthy_2",
    "metric": "wealthy",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "41.58726_-87.336587_325_r3_gemini_edit_0_r8_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__subject_s1__delta_plus3.131__0139_2.40_gary_indiana_41.58726_-87.336587_subject_s1.png"
      }
    ]
  },
  {
    "folder": "wealthy_3",
    "metric": "wealthy",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "19.355013_-99.049999_181_r2_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__background_s1__delta_plus5.076__0002_0.28_mexico_city_iztapalapa_19.355013_-99.049999_background_s1.png"
      }
    ]
  },
  {
    "folder": "wealthy_4",
    "metric": "wealthy",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "6.550436_3.355499_281_r11_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__object_s1__delta_plus1.858__0004_0.31_lagos_mushin_6.550436_3.355499_object_s1.png"
      }
    ]
  },
  {
    "folder": "wealthy_5",
    "metric": "wealthy",
    "input": "input.jpg",
    "outputs": [
      {
        "model": "VIDA-GEO",
        "file": "53.797766_-2.244447_109_r4_gemini_edit_0.jpg"
      },
      {
        "model": "LANCE",
        "file": "LANCE__best__background_s1__delta_plus6.389__0152_2.56_burnley_uk_53.797766_-2.244447_background_s1.png"
      }
    ]
  }
];
