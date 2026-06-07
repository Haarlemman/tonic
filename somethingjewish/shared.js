/**
 * SHARED RESOURCES for Tonic Online
 * Includes: Navigation logic, Language switching, Scroll spy, and Scroll Reveal.
 */

(function () {
    let forcedNavState = null;

    // --- TRANSLATIONS (Core UI only) ---
    window.translations = {
        en: {
            siteName: '<span class="brand-star"><svg class="logo-image-png" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="42" height="42" aria-hidden="true" role="img" aria-label="Magen David"><polygon points="60,10 103.3,85 16.7,85" fill="none" stroke="#000000" stroke-width="7"/><polygon points="60,110 16.7,35 103.3,35" fill="none" stroke="#000000" stroke-width="7"/></svg></span><span class="brand-wordmark">Something<br>Jewish</span>',
            navPeople: 'People',
            navReligion: 'Religion',
            navCultureGroup: 'Culture',
            navScience: 'Science',
            navAntisemitism: 'Antisemitism',
            navTimeline: 'Timeline',
            navMap: 'Map',
            navIsraelGroup: 'Israel',
            navAbout: 'About',
            // NOTE: Sub-navigation structure is defined once in NAV_SUB_STRUCTURE below (authoritative source).
            // The navSub key below is legacy and unused — kept only for reference compatibility.
            footerNavigate: 'Navigate',
            footerExplore: 'Explore',
            footerSeeFurther: 'See further at:',
            footerBackToTop: 'Back to Top',
            footerBrandTitle: 'Something Jewish',
            footerBrandText: 'A comprehensive exploration of Jewish history, communities, and identity.',
            footerAllRightsReserved: '© 2026 - All rights reserved',
            heroTitle: 'Something <em>Jewish</em>',
            heroSubtitle: 'From ancient kingdoms to global diaspora — a comprehensive exploration of Jewish history, communities, culture and identity across time and space.',
            heroCta: 'Start reading →',
            whoisajewSub: 'Who is a Jew?', whoisajewTagline: 'A faith or a people?',
            apeopleSub: 'A scattered People', apeopleTagline: 'Diaspora & Communities',
            cohenSub: 'The Cohens', cohenTagline: 'Genealogy & Priestly Code',
            rottenapplesSub: 'Rotten apples', rottenapplesTagline: 'Ethics & "The Jewish Question"',
            contemporarySub: 'Today', contemporaryTagline: 'Jewish Life in the 21st Century',
            religionSub: 'In the beginning...', religionTagline: 'There was the word',
            literatureSub: 'literature', literatureTagline: 'The People of the Book',
            artSub: 'Art & Design', artTagline: 'From Tabernacle to Transcendence',
            musicSub: 'Music', musicTagline: 'From Temple Psalms to Modern Pop',
            scienceSub: 'Medicine & Technology', scienceTagline: 'Knowledge & Discovery',
            antisemitismSub: 'Ancient Hatred in Modern Forms', antisemitismTagline: 'Dark Currents',
            timelineSub: 'Historical Timeline', timelineTagline: 'From Antiquity to Modern Era',
            mapSub: 'Jewish Communities Across the World', mapTagline: 'Global Diaspora',
            aboutSub: 'Something Jewish', aboutTagline: 'A Comprehensive Exploration',

            // People Section Content
            peopleSectionTitle: 'A blessing or a burden?',
            peopleSectionIntro: 'Four angles on Jewish peoplehood — click any to expand.',
            peopleAshkenaziTitle: 'Ashkenazi Jews',
            peopleAshkenaziText: '<strong>Central & Eastern Europe.</strong> Descendants of medieval Rhineland communities who expanded into Poland, Lithuania, Russia. By 1900 they constituted ~90% of world Jewry. Language: Yiddish. Culture: Hasidic movement, Klezmer, yeshiva traditions. ~11 million today.',
            peopleSephardicTitle: 'Sephardic Jews',
            peopleSephardicText: '<strong>Spain & Portugal diaspora.</strong> Expelled from Iberia in 1492, dispersed to Ottoman Empire, North Africa, Amsterdam, Americas. Language: Ladino (Judæo-Spanish). The Sephardic Rite differs in prayer and practice. ~1-2 million today.',
            peopleMizrahiTitle: 'Mizrahi Jews',
            peopleMizrahiText: '<strong>Middle East & North Africa.</strong> Indigenous communities predating the Arab conquest—never went through European diaspora. Languages: Judæo-Arabic, Judæo-Persian, Aramaic. Distinctive culinary and prayer traditions. ~4-5 million today.',
            peopleYemeniteTitle: 'Yemenite Jews',
            peopleYemeniteText: '<strong>Arabia—possibly since Solomon.</strong> One of the oldest and most isolated communities. Unique Torah reading, handwritten scrolls, silverwork. Operation Magic Carpet (1949–50) airlifted nearly the entire community to Israel. ~400,000 today.',
            peopleIraqiTitle: 'Iraqi / Babylonian Jews',
            peopleIraqiText: '<strong>Mesopotamia—oldest continuous community since 586 BCE.</strong> Produced the Babylonian Talmud (the most authoritative rabbinic text). Baghdad was 1/3 Jewish in 1900. Most emigrated to Israel after 1948. ~200,000 today.',
            peopleChineseTitle: 'Chinese Jews',
            peopleChineseText: '<strong>Kaifeng & Shanghai.</strong> Kaifeng community traced to Silk Road merchants (c. 1000 CE). Shanghai became a refuge for 20,000+ Jews fleeing Nazis in 1930s. Small but resilient community.',
            peopleLatAmTitle: 'Latin American Jews',
            peopleLatAmText: '<strong>Argentina, Brazil, Mexico.</strong> Argentina (~200k) is the largest community in the region. Formed by 19th-20th century migration. Integration into local culture while maintaining Jewish identity.',
            peopleMountainTitle: 'Mountain Jews (Juhuro)',
            peopleMountainText: '<strong>Caucasus (Azerbaijan, Dagestan).</strong> Descendants of Persian Jews who settled in the mountains in the 5th century. Unique language: Juhuri (Judæo-Tat). Rich tradition of craftsmanship and distinct liturgy.',
            peopleItalkimTitle: 'Italkim (Italian Jews)',
            peopleItalkimText: '<strong>Italy—since the Roman Republic.</strong> One of the oldest continuous communities in Europe. Neither Ashkenazi nor Sephardic, they maintain the unique "Nusach Italki" (Italian Rite). Centers: Rome, Venice, Florence.',
            peopleBetaIsraelTitle: 'Beta Israel (Ethiopian Jews)',
            peopleBetaIsraelText: '<strong>Ethiopia—practiced isolated Judaism for 2,000 years.</strong> Traced to Queen of Sheba and King Solomon. Maintained ancient Torah (Orit). Most were airlifted to Israel in 1980s-90s. ~160,000 today.',
            peopleIndianTitle: 'Indian Jews',
            peopleIndianText: '<strong>Bene Israel, Cochin, Baghdadi Jews.</strong> Arrived in waves over 2,000 years. Thrived in a culture of religious tolerance. Centers: Mumbai, Kochi, Kolkata. Most emigrated to Israel after 1948.',
            peopleSamaritanTitle: 'Samaritans (Shomronim)',
            peopleSamaritanText: '<strong>Mount Gerizim & Holon.</strong> Not strictly "Jews" in the rabbinic sense but share common Israelite ancestry. Follow only the Torah (Pentateuch). Ancient, tightly-knit community of ~800 people.',

            // Religion Section Content
            religionIntro: 'Judaism begins with text, but not with text alone. The Bible, rabbinic debate, legal interpretation, poetry, folklore, and mystical commentary form a layered tradition where reading is itself a religious act.',
            sacredTanakhTorahTitle: 'The Bible',
            sacredTanakhTorahText: 'The Tanakh is the Hebrew Bible, consisting of Torah (Law), Nevi\'im (Prophets), and Ketuvim (Writings). The Torah, or Five Books of Moses, is the foundation of Jewish law, story, and identity.',
            sacredTalmudTitle: 'Talmud',
            sacredTalmudText: 'The Talmud is the great record of rabbinic argument: Mishnah plus Gemara. It turns biblical law into lived practice through debate, precedent, story, minority opinions, and legal reasoning.',
            sacredZoharTitle: 'Zohar',
            sacredZoharText: 'The Zohar is the central work of Kabbalah, reading Torah as a symbolic map of divine emanations, hidden meanings, spiritual repair, and the inner life of creation.',
            authorshipDatingHeading: 'AUTHORSHIP and DATING',
            sacredChaptersTitle: 'A Small Map of the Library',
            sacredChaptersIntro: 'The Jewish library is not one book in a straight line. It is a conversation between law, narrative, prophecy, poetry, wisdom, argument, and mystical imagination.',
            chapPentateuchTitle: 'Pentateuch',
            chapPentateuchText: 'The Greek name for the Torah\'s five books; in Jewish life, simply Torah.',
            chapGenesisTitle: 'Genesis',
            chapGenesisText: 'Creation, covenant, family conflict, Abraham and Sarah, Jacob, Joseph, and the descent to Egypt.',
            chapExodusTitle: 'Exodus',
            chapExodusText: 'Slavery, liberation, Sinai, law, wilderness, and the political birth of Israel as a people.',
            chapPsalmsTitle: 'Psalms',
            chapPsalmsText: 'Prayer-poetry for fear, grief, gratitude, kingship, exile, and praise.',
            chapJobTitle: 'Job',
            chapJobText: 'A fierce argument about suffering, innocence, divine justice, and the limits of explanation.',
            chapJonahTitle: 'Jonah',
            chapJonahText: 'A compact prophetic tale about evasion, mercy, repentance, and resentment.',
            chapEcclesiastesTitle: 'Ecclesiastes',
            chapEcclesiastesText: 'Wisdom literature that faces vanity, mortality, work, pleasure, and the search for meaning.',
            chapTalmudTitle: 'Talmudic Pages',
            chapTalmudText: 'Not chapters but layered pages: law, story, challenge, answer, objection, and counter-objection.',
            sacredTimingTitle: 'Timing & Authorship',
            sacredTimingIntro: 'Jewish tradition and modern scholarship answer the authorship question differently. Tradition often speaks in terms of revelation and named prophets or sages; academic study usually sees long processes of composition, editing, transmission, and canonization.',
            timingTanakhTorahTitle: 'Authorship & Canonization',
            timingTanakhTorahText: 'The Torah was traditionally revealed at Sinai; academic study sees a long process of compilation (10th-5th c. BCE). The Prophets and Writings were canonized over several centuries, with the full Tanakh reaching its final form in the late Second Temple period.<br><br>The Mishnah was compiled around 200 CE, traditionally associated with Rabbi Judah ha-Nasi. The Jerusalem and Babylonian Talmuds grew over the following centuries, with the Babylonian Talmud largely completed around 500 CE.<br><br>Tradition attributes the Zohar to the 2nd-century sage Shimon bar Yochai. Most academic scholars date its main composition to 13th-century Spain, especially around Moses de León, while recognizing older mystical roots.',
            timingWisdomTitle: 'Wisdom & Story',
            timingWisdomText: 'Job, Jonah, Ruth, Esther, and Ecclesiastes are usually treated as literary-theological works with uncertain authorship. Their power lies less in a known author than in the questions they stage.',
            timingTalmudTitle: 'Mishnah & Talmud',
            timingTalmudText: 'The Mishnah was compiled around 200 CE, traditionally associated with Rabbi Judah ha-Nasi. The Jerusalem and Babylonian Talmuds grew over the following centuries, with the Babylonian Talmud largely completed around 500 CE.',
            timingZoharTitle: 'Zohar',
            timingZoharText: 'Tradition attributes the Zohar to the 2nd-century sage Shimon bar Yochai. Most academic scholars date its main composition to 13th-century Spain, especially around Moses de León, while recognizing older mystical roots.',
            ritualsTitle: 'Rituals, Observances, Holidays & Terms',
            ritualsIntro: 'Jewish time is shaped by weekly rest, seasonal festivals, fast days, life-cycle rituals, food practices, and words that carry centuries of memory across languages and communities.',
            ritualShabbatTitle: 'Shabbat (Sjabbes)',
            ritualShabbatText: 'The weekly Sabbath, from Friday evening to Saturday night: candles, kiddush, challah, rest, prayer, family meals, and a deliberate pause from ordinary work.',
            ritualPesachTitle: 'Pesach',
            ritualPesachText: 'Passover, the spring festival of liberation from Egypt. The seder meal retells Exodus through matzah, bitter herbs, wine, questions, songs, and symbolic foods.',
            ritualPurimTitle: 'Purim',
            ritualPurimText: 'A joyful holiday around the Book of Esther: reading the megillah, costumes, charity, gifts of food, noise for Haman, and a carnival mood.',
            ritualRoshHashanahTitle: 'Rosh Hashanah',
            ritualRoshHashanahText: 'The Jewish New Year and beginning of the High Holy Days. Marked by the shofar, prayer, self-examination, apples and honey, and hopes for a sweet year.',
            ritualYomKippurTitle: 'Yom Kippur',
            ritualYomKippurText: 'The Day of Atonement, the most solemn day of the Jewish calendar: fasting, confession, forgiveness, repair, and the closing Neilah service.',
            ritualSukkotTitle: 'Sukkot',
            ritualSukkotText: 'The harvest festival of booths, recalling wilderness wandering. Families eat in a sukkah and wave the lulav and etrog.',
            ritualHanukkahTitle: 'Hanukkah',
            ritualHanukkahText: 'An eight-day winter festival remembering the Maccabean revolt and rededication of the Temple, marked by lighting the hanukkiah, songs, games, and fried foods.',
            ritualKashrutTitle: 'Kashrut',
            ritualKashrutText: 'Jewish dietary law: kosher and non-kosher animals, separation of meat and dairy, ritual slaughter, and everyday discipline around eating.',
            ritualMitzvahTitle: 'Mitzvah',
            ritualMitzvahText: 'A commandment or sacred obligation. In everyday speech it can also mean a good deed, but its root meaning is covenantal responsibility.',
            ritualBarBatTitle: 'Bar / Bat Mitzvah',
            ritualBarBatText: 'The coming-of-age moment when a young Jew becomes responsible for mitzvot, often marked by Torah reading, prayer leadership, study, and celebration.',
            ritualBritTitle: 'Brit Milah',
            ritualBritText: 'The covenant of circumcision, traditionally performed on the eighth day for Jewish boys, linking family, body, ancestry, and covenant.',
            ritualTzedakahTitle: 'Tzedakah',
            ritualTzedakahText: 'Often translated as charity, but closer to justice or obligation: giving because the community and the vulnerable have a claim on us.',
            religionMovementsTitle: 'Movements & Practice',
            religionMovementsIntro: 'Across geography and history, Jews developed different interpretations of Torah, liturgical practices, and degrees of observance. From Orthodoxy to Reform, from Hasidic mysticism to secular humanism, Jewish religious life spans a wide spectrum.',
            religionOrthodox_Title: 'Orthodox',
            religionOrthodox_Text: 'Emphasizes strict adherence to Torah and Talmudic law. Subdivisions include Haredi (ultra-Orthodox), Modern Orthodox, and Hasidic movements. Maintains traditional gender roles, dietary laws, Sabbath observance, and study of sacred texts.',
            religionConservative_Title: 'Conservative',
            religionConservative_Text: 'Seeks balance between traditional Jewish law and modern life. Originated in 19th-century Germany; strong in America. Allows rabbinical flexibility on interpretation while maintaining core observances. Often called "Masorti" (traditional) in Israel.',
            religionReform_Title: 'Reform',
            religionReform_Text: 'Emphasizes ethical monotheism and personal interpretation of Torah. Began in early 19th-century Europe; most liberal denomination. Women and LGBTQ+ are fully included in religious life. Focus on universal values and social justice.',
            religionReconstructionist_Title: 'Reconstructionist',
            religionReconstructionist_Text: 'Views Judaism as an evolving civilization, not revealed law. Emphasizes community, creativity, and democratic decision-making in spiritual matters. Incorporated Jewish feminism early and pioneered egalitarian worship.',
            religionHasidic_Title: 'Hasidic',
            religionHasidic_Text: 'An ecstatic, mystical movement founded in 18th-century Eastern Europe by the Baal Shem Tov. Emphasizes joy, spiritual elevation through prayer and song, reverence for a tzaddik (holy leader). Still thriving in insular communities worldwide.',
            religionSecular_Title: 'Secular',
            religionSecular_Text: 'Many Jews are secular or cultural—identifying as Jewish through ethnicity, history, and social/ethical commitments rather than religious belief. Supports Jewish continuity through language (Yiddish, Hebrew), art, activism, and community, not theology.',
            religionNeturei_Title: 'Neturei Karta',
            religionNeturei_Text: 'A fringe ultra-Orthodox group known for their vocal opposition to Zionism and the State of Israel on religious grounds. They believe a Jewish state can only be established by the Messiah.',
            religionOrthodox_Tagline: 'Ancient Law & Modern Life',
            religionConservative_Tagline: 'Tradition & Change',
            religionReform_Tagline: 'Progress & Inclusion',
            religionReconstructionist_Tagline: 'Evolving Civilization',
            religionSecular_Tagline: 'Culture & Identity',
            religionNeturei_Tagline: 'Guardians of the City',
            cohenText1: 'The name Cohen (or Kahn, Cohn, Kahanoff, etc.) represents one of the world\'s largest extended families—all descendants of the ancient Jewish priestly class and specifically of Aaron, the brother of Moses. In biblical times, the Kohanim (priests) served in the Temple and held sacred duties. After the Temple\'s destruction in 70 CE, while they lost their priestly functions, the genealogical line persisted.',
            cohenPoint1Title: 'The Priestly Code',
            cohenPoint1Text: 'Kohanim had exclusive rights to perform Temple sacrifices, blessings, and sacred rituals. Their role ended with the Temple\'s destruction but cultural status persisted.',
            cohenPoint2Title: 'Genetic Legacy',
            cohenPoint2Text: 'The Cohen Modal Haplotype (a specific DNA pattern) appears in ~55% of men surnamed Cohen, and is rare in the general population—strong evidence of patrilineal descent from the ancient priesthood.',
            cohenPoint3Title: 'Global Cohens Today',
            cohenPoint3Text: 'From Leonard Cohen (musician) to Sacha Baron Cohen (actor) to countless scholars, scientists, and artists—the Cohen name spans every continent and profession, united by an ancient genealogy.',
            financeIntro1: 'Jewish involvement in finance has deep historical roots—from medieval moneylenders (forced into finance by Christian restrictions) to modern banking dynasties. Rothschilds, Goldman Sachs, and countless Jewish financiers shaped capitalism. This reality has fueled centuries of antisemitic conspiracy theories.',
            financeIntro2: '<strong>The "Bad Jews" phenomenon:</strong> The phrase emerged to describe Jews who violated community norms or behaved unethically. This includes:',
            financePoint1Title: 'Financial Scandals',
            financePoint1Text: 'Bernie Madoff\'s $65 billion Ponzi scheme devastated many Jewish philanthropies. His identity as a Jewish insider made betrayal cut deeper within the community. Sam Bankman-Fried\'s FTX collapse later revived the same questions about wealth, public trust, and communal responsibility.',
            financePoint4Title: 'Predators and Power',
            financePoint4Text: 'Harvey Weinstein and Jeffrey Epstein were not financial scandals so much as abuses of status, access, silence, and protection. Their cases belong here because they show how prestige can become cover, and how communities have to face wrongdoing without defensiveness.',
            financePoint5Title: 'Where Did They Escape To?',
            financePoint5Text: 'They did not escape to some hidden communal refuge. Madoff died in federal prison; Weinstein was convicted and imprisoned; Epstein died in jail while awaiting federal trial; Bankman-Fried was convicted and sentenced to prison. The point is accountability, not collective blame.',
            contemporaryIntro: 'Today\'s Jews are a global diaspora shaped by internet, migration, intermarriage, and diverse belief systems. Geographic and cultural communities continue to thrive while new forms of Jewish identity emerge.',
            scienceIntro: 'Jewish thinkers have advanced mathematics, physics, medicine, computer science, and more—often with global impact while facing cultural and political challenges.',
            antisemitismIntro: 'Antisemitism is the world\'s oldest hatred. It has evolved from religious persecution to racial pseudo-science and modern conspiracy theories. In the 21st century, it persists in radical forms.',

            // Antisemitism Content (EN)
            anti911Title: '9/11 as Watershed (2001)', anti911Text: 'Al-Qaeda\'s attacks shifted global terrorism paradigm.',
            antiEuropeanTitle: 'European Murder-Attacks (2002-2004)', antiEuropeanText: 'Assassinations of Islam-critics Pim Fortuyn (2002) and filmmaker Theo van Gogh (2004) highlighted tensions in Europe and Asia. Van Goghs killer left a note threatening the politician Ayaan Hirsi Ali <em>and</em> containing antisemitic rhetoric. Revealed intersection of Islamic violence and antisemitic ideology.',
            antiWaveTitle: 'Terror Wave Across Europe (2004-2017)', antiWaveText: 'Al-Qaeda s attacks shifted global terrorism paradigm. Subsequent jihadist attacks — Madrid (2004), London 7/7 (2005), Mumbai (2008)—often included antisemitic ideology. Jewish institutions and synagogues became  security concerns across Western world.',
            antiCampusTitle: 'Campus Antisemitism & BDS', antiCampusText: 'BDS movement often crosses into antisemitism.',
            antiSocialMediaTitle: 'Social Media & Viral Antisemitism', antiSocialMediaText: 'Online platforms amplify ancient tropes.',
            antiOct7Title: 'October 7 Fallout', antiOct7Intro: 'Antisemitic incidents reached historic highs following the Hamas attack.',
            antiOct7SurgeTitle: 'Incidents Surge', antiOct7SurgeText: 'USA, France, and UK report record-breaking numbers of assaults.',
            antiOct7CampusTitle: 'Campus Chaos', antiOct7CampusText: 'Jewish students report fearing for safety.',
            antiOct7StreetTitle: 'Street Harassment', antiOct7StreetText: 'Visible Jewish symbols lead to increased harassment globally.',
            antiOct7AllianceTitle: 'Left-Islam Alliance', antiOct7AllianceText: 'Political alignments between progressive and Islamist groups.',
            antiOct7FracturesTitle: 'Global Diaspora Fractures', antiOct7FracturesText: 'Unprecedented polarization and tension within Jewish communities.',
            antiModernTitle: 'Modern Antisemitism: Key Characteristics',
            antiModernAntiZionism: '<strong>Weaponized Anti-Zionism:</strong> Blurs criticism of policy into denial of self-determination.',
            antiModernConspiracy: '<strong>Conspiracy Theories:</strong> Blaming Jews for violence against themselves.',
            antiModernReligion: '<strong>Religious Antisemitism:</strong> Radical interpretations used to justify violence.',
            antiModernDiaspora: '<strong>Diaspora Vulnerability:</strong> Global Jews face attacks whenever Middle East tensions escalate.',
            antiModernIntersectionality: '<strong>Intersectionality Weaponized:</strong> Positions Jews as "oppressors."',

            // Map & Footer (EN)
            mapIntro: 'A visual overview of the major Jewish communities throughout history and across the globe.',
            mapInstruction: 'Hover over regions to preview history, click for full details.',
            israelFacts: 'Key Facts',
            israelIndigenous: 'Indigenous',
            israelDemographics: 'Demographics',
            israelMyths: 'Myths',
            israelRegion: 'Region',
            israelDemocracy: 'Democracy',
            israelAntisemitism: 'Anti-zionism',
            israelVoices: 'Voices',
            israelCriticism: 'Criticism',

            // Religion — Attire subsection (EN)
            relAttireTitle: 'Attire & Religious Dress',
            relAttireIntro: 'Jewish dress codes vary widely by community, level of observance, and tradition — from the barely visible to the immediately recognizable.',
            relKippahTitle: 'Kippah (Yarmulke)',
            relKippahText: 'A small head covering worn by Jewish men as a sign of reverence before God. Style varies greatly: knitted (srugah) among Modern Orthodox and Religious Zionist men; plain black velvet among Haredi Orthodox; suede or leather among many traditional Jews. Worn at all times by the observant, during prayer only by others — or not at all.',
            relPeyotTitle: 'Peyot (Sidelocks)',
            relPeyotText: 'Long, uncut sidelocks grown by many Orthodox and Hasidic Jewish men, rooted in the biblical prohibition against "rounding the corners of the head" (Leviticus 19:27). Style varies from short curls kept tucked behind the ear to dramatically long, spiraling locks worn in front. Particularly prominent among Yemenite and Hasidic Jews.',
            relShtreibelTitle: 'Shtreimel & Spodik',
            relShtreibelText: 'Large, circular fur hats worn by married Hasidic men on Shabbat and Jewish holidays. The shtreimel (flat, wide brim of sable or other fur) is associated with Polish and Galician Hasidic courts; the spodik (tall and cylindrical) with Lithuanian and Polish Hasidim. These hats were originally 18th-century Eastern European aristocratic dress, adopted as festive Jewish attire.',
            relTzitzitTitle: 'Tzitzit (Fringes)',
            relTzitzitText: 'Knotted fringes attached to the four corners of a garment, commanded in Numbers 15:38–40. Worn under clothing as a tallit katan (small prayer shawl) by observant men throughout the day; sometimes deliberately left visible hanging below the shirt. A full-size tallit (prayer shawl) with tzitzit is worn during morning prayer services.',
            relTzniutTitle: 'Tzniut (Modest Dress)',
            relTzniutText: 'The concept of modesty (tzniut) governs dress standards in observant communities, particularly for women. This typically means covered elbows, knees, and collarbone. Married Orthodox women cover their hair with a sheitel (wig), tichel (headscarf), or hat. In Haredi communities, norms are stricter; in Modern Orthodox communities, there is more variation. Non-Orthodox Jews generally observe no specific dress codes.',
            relBekkesheTitle: 'Bekishe & Kapote',
            relBekkesheText: 'Long black coats worn by Hasidic men, rooted in 18th-century Eastern European dress. The bekishe (silk frock coat) is worn on Shabbat and holidays; the kapote (a more everyday long coat) is worn on weekdays. White shirts, dark trousers, and black shoes complete the ensemble. Black is not a sign of mourning — it simply reflects the historic dress of Polish nobility, preserved as tradition.',

            // Missing keys — added
            heroLabel: 'Three Thousand Years',
            whoisajewTagline: 'A faith or a people?',
            whoisajewIntro: 'The question of "Who is a Jew?" is one of the most complex debates in Jewish history, involving religious law, secular identity, and modern civil statutes. Because Judaism is an ethno-religion, the definition varies depending on whether you are looking through a legal, religious, or personal lens.',
            whoisajewPoint1Title: 'Traditional Religious Definition (Halakha)',
            whoisajewPoint1Text: 'According to Halakha (Jewish law), followed by Orthodox and Conservative movements, a person is Jewish if their mother was Jewish at the time of their birth (Matrilineal Descent), or if they have undergone a formal conversion process recognized by a rabbinic court (Bet Din).',
            whoisajewPoint2Title: 'Modern Denominational Shifts',
            whoisajewPoint2Text: 'In the 20th century, the definition expanded. Reform and Reconstructionist Judaism recognize Patrilineal Descent if the child is raised with a Jewish identity. Some secular Jews define identity through culture, history, or ethnicity rather than religious observance.',
            whoisajewPoint3Title: 'The Secular State Perspective (Law of Return)',
            whoisajewPoint3Text: 'The State of Israel\'s Law of Return (1950) grants citizenship to anyone with at least one Jewish grandparent or a Jewish spouse. This protects those facing antisemitism, even if the Rabbinate doesn\'t recognize them for religious purposes like marriage.',
            whoisajewSummary: 'Ultimately, it is a tension between Am Yisrael (the People of Israel) as a biological family and Torat Yisrael (the Law of Israel) as a religious covenant.',
            apeopleTagline: 'Diaspora & Communities',
            peopleIntro: 'Jewish identity transcends geography. From ancient Israel to the modern diaspora, Jews have maintained distinct communities while spreading across every continent. The major branches—Ashkenazi, Sephardic, Mizrahi, and many others—each carry unique traditions, languages, and histories.',
            cohenTagline: 'Genealogy & Priestly Code',
            rottenapplesTagline: 'Ethics & "The Jewish Question"',
            contemporaryTagline: 'Jewish Life in the 21st Century',
            todayPoint1Title: 'Digital Diaspora',
            todayPoint1Text: 'The internet has created a borderless Jewish community. From digital yeshivas to Jewish ancestry groups, technology allows for global connection and the preservation of rare dialects like Ladino and Jiddisch.',
            todayPoint2Title: 'Interfaith & Diversity',
            todayPoint2Text: 'Rising rates of intermarriage and the inclusion of diverse voices (LGBTQ+, Jews of Color) are redefining what it means to be a Jewish family. Pluralism is becoming the hallmark of the 21st-century diaspora.',
            todayPoint3Title: 'Revitalization',
            todayPoint3Text: 'A new generation is rediscovering ancient traditions—through food, art, and environmental activism (Eco-Judaism). This "New Jew" movement blends heritage with progressive values.',
            religionTagline: 'There were words',
            financePoint2Title: 'Ethical Tensions',
            financePoint2Text: 'The tension between religious law (Halakha) and modern business ethics is a constant dialogue. Figures like Sam Bankman-Fried (FTX) have reignited debates about ethics, wealth, and communal responsibility in the 21st century.',
            financePoint3Title: 'Controversial Figures',
            financePoint3Text: 'From figures like Roy Cohn (political fixer) to modern controversial billionaires, the actions of high-profile Jews often face intense scrutiny both from within and outside the community, highlighting the burden of representation.',
            literatureSubTitle: 'The People of the Book',
            literatureIntro: 'Jewish literature spans sacred texts, Talmudic debates, mystical poetry, secular modernism, and contemporary fiction. From the narrative cycles of Genesis and Exodus in the Hebrew Bible (Tanakh) to 21st-century novelists, Jews have been obsessed with interpretation, storytelling, and ethical inquiry.',
            litTanakhTitle: 'The Bible',
            litTanakhText: 'The Hebrew Bible (Tanakh) is a collection of 39 books spanning law, prophecy, history, and poetry. Written over a millennium, it forms the foundation of Jewish law, ethics, and narrative identity.',
            litTalmudTitle: 'The Talmud',
            litTalmudText: 'Massive compendium of rabbinic debate (c. 200–500 CE) on Torah interpretation. Two versions: Bavli (Babylonian—authoritative) and Yerushalmi (Jerusalem). Centerpiece of Jewish learning for 1500+ years. Intricate, dialectical reasoning about law and ethics.',
            litZoharTitle: 'The Zohar & Kabbalah',
            litZoharText: 'Medieval mystical texts interpreting Torah through esoteric symbols and divine emanations. The Zohar (13th century, Spain/Provence) is the main work. Kabbalah emphasizes hidden meanings, meditation, and the mystical names of God. Profound influence on Jewish spirituality.',
            litPotokTitle: 'Chaim Potok',
            litPotokText: '20th-century American Jewish novelist. <em>The Chosen</em>, <em>My Name Is Asher Lev</em>—explore identity, faith, art, and modernity within Orthodox communities. Accessible, deeply humanistic exploration of Jewish inner life.',
            litSingerTitle: 'Isaac Bashevis Singer',
            litSingerText: 'Yiddish novelist (1902–1991). Won Nobel Prize in Literature. <em>The Family Moskat</em>, <em>Shadows on the Hudson</em>—vivid depictions of Polish Jewish shtetl life, mysticism, and American immigrant experience. Master of supernatural and philosophical storytelling.',
            litRothTitle: 'Philip Roth',
            litRothText: 'American master of realism and postmodernism. <em>Portnoy\'s Complaint</em>, <em>Sabbath\'s Theater</em>. Explores Jewish identity, sexuality, American ambition, and the tension between tradition and desire. Controversial, brilliant.',
            litKeretTitle: 'Etgar Keret',
            litKeretText: 'Israeli contemporary master of the short story. Minimalist, darkly comic, profound. Captures modern Israeli life, war, alienation, love. Adaptable to film. <em>Suddenly, a Knock on the Door</em>. Voice of 21st-century Hebrew literature.',
            litOzTitle: 'Amos Oz',
            litOzText: 'Israeli literary giant (1939–2018). <em>A Tale of Love and Darkness</em>, <em>My Michael</em>. Explored Israeli identity, kibbutz life, Arab-Jewish relations, and the human condition. Nobel Prize nominee. Profound influence on Hebrew literature and Israeli intellectual discourse.',
            litAleichemTitle: 'Sholem Aleichem & I.L. Peretz',
            litAleichemText: 'Yiddish literary giants of Eastern Europe (late 1800s). Depicted shtetl life with humor, pathos, and social critique. <em>Tevye the Dairyman</em> (basis of <em>Fiddler on the Roof</em>). Preserved a vanished world in literature.',
            artSubTitle: 'From Tabernacle to Transcendence',
            artIntro: 'Judaism historically discouraged representational art (to avoid idolatry), yet Jewish artists have become titans of modernism, surrealism, abstraction, and contemporary practice. The 20th century unleashed Jewish creative genius across all visual media.',
            artChagallTitle: 'Marc Chagall',
            artChagallText: 'Vitebsk-born (1887–1985). Dreamlike canvases fusing Jewish folklore, shtetl memory, and surrealist color. <em>I and the Village</em>, <em>The Birthday</em>. Biblical themes, floating figures, goats and fiddlers. The most "Jewish" painter of the 20th century.',
            artRothkoTitle: 'Mark Rothko',
            artRothkoText: 'Latvian-born abstract expressionist (1903–1970). Large color-field paintings of almost religious intensity. Rejected narrative for pure emotion. His Seagram Murals and the Rothko Chapel represent the sublime in modern art.',
            artDesignTitle: 'Graphic Design & Typography',
            artDesignText: 'Jewish designers—Herb Lubalin, El Lissitzky, Peter Behrens—defined modernist typography and layout. The Bauhaus had deep Jewish involvement. Hebrew lettering became an art form. Israeli graphic design is internationally influential.',
            artSupermanTitle: 'Comics & Graphic Novels',
            artSupermanText: 'Superman, created by Jerry Siegel and Joe Shuster, represents the immigrant experience: an outsider saving the world under a secret identity. Jewish artists also pioneered the modern graphic novel, from Will Eisner’s seminal <em>A Contract with God</em> to Art Spiegelman’s Pulitzer Prize-winning <em>Maus</em>.',
            artArchitectureTitle: 'Architecture',
            artArchitectureText: 'From Daniel Libeskind (Jewish Museum Berlin) to Frank Gehry, Jewish architects have shaped iconic spaces. Libeskind\'s jagged, trauma-informed forms gave physical shape to memory and absence.',
            artSculptureTitle: 'Anish Kapoor',
            artSculptureText: 'Mumbai-born, London-based sculptor. <em>Cloud Gate</em> (Chicago), the Orbit tower (London). Master of reflective surfaces, voids, and monumental scale. Jewish heritage meets Hindu-Buddhist aesthetic.',
            musicSubTitle: 'From Temple Psalms to Modern Pop',
            musicIntro: 'Jewish musical traditions range from the ancient Temple liturgy to Klezmer dance, operatic performance, jazz innovation, and contemporary pop. The immigrant experience shaped American music in profound ways.',
            musicLiturgyTitle: 'Liturgical Music',
            musicLiturgyText: 'The cantor (chazan) is a soloist who leads prayer. Chanting Torah portions, Kol Nidre on Yom Kippur, synagogue choirs — Jewish sacred music has a distinctive sound shaped by modal scales (nigunim) with Eastern European, Sephardic, and Mizrahi variations.',
            musicHasidicTitle: 'Hasidic Nigunim',
            musicHasidicText: 'Wordless melodies (nigunim) designed for spiritual elevation. The Ba\'al Shem Tov taught that music could reach the soul directly. Carlebach melodies have crossed denominational lines to become universal Jewish song.',
            musicKlezmerTitle: 'Klezmer',
            musicKlezmerText: 'Eastern European Jewish folk music. Clarinet-driven, emotionally versatile — from wedding dances to laments. Near-extinct after the Holocaust, revived in the 1970s by American musicians. Now a global genre blended with jazz, rock, and world music.',
            musicJazzClassicalTitle: 'Jazz & Classical',
            musicJazzClassicalText: 'George Gershwin bridged classical and popular. Leonard Bernstein was America\'s greatest conductor and composer (<em>West Side Story</em>). Benny Goodman, Artie Shaw — Jews defined swing. Aaron Copland created "the American sound."',
            musicPopRockTitle: 'Pop & Rock',
            musicPopRockText: 'Bob Dylan (born Zimmerman). Paul Simon. Billy Joel. Carole King. Lou Reed. The Ramones. The musical DNA of 20th-century America. Often working-class New York Jewish backgrounds channeled into universal art. In hip-hop, three Jewish kids from New York — Mike D, Ad-Rock, MCA (The Beastie Boys) — helped pioneer the genre, showing that hip-hop also has a distinct Jewish thread woven into its history.',
            musicIsraeliTitle: 'Israeli Music',
            musicIsraeliText: 'From pioneering Zionist songs (<em>Hatikvah</em>) to contemporary pop stars (Idan Raichel, Dudu Tasa, Noa Kirel). Israeli music fuses Mediterranean, Mizrahi, and global influences. Eurovision wins. A thriving, genre-defying scene.',
            musicMatisyahuTitle: 'Matisyahu & Contemporary',
            musicMatisyahuText: 'Hasidic reggae artist who brought Jewish themes to a global audience. The boundary between sacred and secular in Jewish music continues to blur — religious rappers, Orthodox DJs, and Klezmer metal bands.',
            cinemaSub: 'Cinema',
            cinemaLabel: 'Screen & Story',
            cinemaIntro: 'Jews built Hollywood. From the silent era to today, Jewish producers, directors, writers, and actors have shaped global cinema. The immigrant desire to tell stories, reinvent oneself, and navigate between worlds drove an entire art form.',
            cinemaMarxTitle: 'The Marx Brothers',
            cinemaMarxText: 'Groucho, Chico, Harpo (b. Manfred, Leonard, Julius Marx). Revolutionary comedians who dismantled authority, logic, and dignity with surreal speed. <em>Duck Soup</em>, <em>A Night at the Opera</em>. Jewish humor as total cultural subversion.',
            cinemaWoodyTitle: 'Woody Allen',
            cinemaWoodyText: 'Writer-director-actor (b. Allen Konigsberg). Neurotic, intellectual humor. <em>Annie Hall</em>, <em>Manhattan</em>, <em>Stardust Memories</em>. Brought Jewish self-analysis and anxiety into the art cinema mainstream. Deeply controversial personally, undeniably influential.',
            cinemaSpielbergTitle: 'Steven Spielberg',
            cinemaSpielbergText: 'Master storyteller—adventure (<em>Indiana Jones</em>), war (<em>Saving Private Ryan</em>), and Holocaust (<em>Schindler\'s List</em>). Spielberg\'s Jewish identity runs through his work, culminating in <em>Schindler\'s List</em>, which he said he "owed to history."',
            cinemaKubrickTitle: 'Stanley Kubrick',
            cinemaKubrickText: 'Perfectionist master of form. <em>A Clockwork Orange</em>, <em>2001: A Space Odyssey</em>, <em>The Shining</em>. Jewish Bronx origins filtered into a cold, cerebral cinematic vision. The director\'s director.',
            cinemaActorsTitle: 'Titans of the Screen: Iconic Actors',
            cinemaActorsText: 'Kirk Douglas, Tony Curtis, Lauren Bacall, Dustin Hoffman, Barbra Streisand, Jerry Seinfeld, Sarah Silverman, Natalie Portman — Jewish actors have defined American screen performance across a century, navigating identity, stereotypes, and stardom.',
            cinemaStoryTitle: 'Jewish Storytelling on Screen',
            cinemaStoryText: 'Jewish filmmakers have created essential films examining identity, diaspora, memory, and humor. <em>Fiddler on the Roof</em>, <em>Yentl</em>, <em>The Producers</em>, <em>Shoah</em>, <em>Life is Beautiful</em>. The screen became a place to witness survival.',
            scienceTagline: 'Knowledge & Discovery',
            scienceBioTitle: 'Biology & Medicine',
            scienceBioText: 'Jonas Salk (polio vaccine), Aaron Klug (crystallography), Elisabeth Blackburn (telomere research). Jewish scientists shaped modern medicine and biology out of proportion to their numbers. Salk refused to patent the polio vaccine.',
            scienceMedicineTitle: 'Psychiatry & Psychology',
            scienceMedicineText: 'Sigmund Freud invented psychoanalysis. Viktor Frankl created logotherapy from a concentration camp. Abraham Maslow built the hierarchy of needs. Jewish thinkers created the language through which the modern world understands the self.',
            scienceMathTitle: 'Mathematics & Physics',
            scienceMathText: 'Albert Einstein, Richard Feynman, Niels Bohr (half Jewish), David Hilbert, Emmy Noether, John von Neumann. The Jewish contribution to 20th-century physics and mathematics reshaped our understanding of reality itself.',
            scienceTechTitle: 'Technology & Computing',
            scienceTechText: 'Google (Brin/Page), Intel (Andy Grove), Dell (Michael Dell), Oracle (Larry Ellison). The Jewish contribution to Silicon Valley is profound. Israel\'s "Start-Up Nation" has more NASDAQ-listed companies than any country except the US and China.',
            antisemitismTagline: 'Dark Currents',
            antiTerrorTitle: 'The Terror Era',
            antiTerrorIntro: 'From 2001 to the present, antisemitism mutated again — finding new expression through jihadist ideology, online radicalization, and a new fusion of far-right and far-left narratives.',
            antiConspiracyTitle: 'Conspiracy & Replacement Theory',
            antiConspiracyText: 'The "Great Replacement" conspiracy theory — that Jews orchestrate non-white immigration to destroy white culture — drove attacks in Pittsburgh (2018), Halle (2019), and Jersey City (2019). These are not isolated lone wolves; they share a text.',
            antiRacialTitle: 'Racial Antisemitism',
            antiRacialText: 'The 19th and 20th century saw the transformation of religious anti-Judaism into racial pseudoscience. Jews were classified as a distinct, inferior race. This ideology reached its logical end in the Holocaust — the systematic murder of 6 million Jews.',
            antiReligiousTitle: 'Religious Antisemitism',
            antiReligiousText: 'For centuries, Christian Europe accused Jews of deicide (killing Christ), well-poisoning, and ritual murder (blood libel). These lies drove pogroms, expulsions, and massacres. Medieval antisemitism formed the template for later racial theories.',
            antiIslamicTitle: 'Islamic Antisemitism',
            antiIslamicText: 'While many Muslims and Jews lived peacefully together historically, modern political Islam has incorporated antisemitic conspiracy theories, especially through Hamas, Hezbollah, and Iranian state propaganda. This is distinct from Islamic tradition itself.',
            antiProgressiveTitle: 'Progressive Antisemitism',
            antiProgressiveText: 'A new form emerged in the 21st century: framing Jews as inherently "privileged" oppressors in intersectional frameworks, applying to Zionism standards applied to no other national movement, and dismissing Jewish concerns as manipulation.',
            antiLeftIslamTitle: 'The Left-Islam Alliance',
            antiLeftIslamText: 'Post-October 7, a political alignment emerged between Western progressive movements and Islamist groups, united by anti-Israel sentiment. Many Jewish progressives felt abandoned by allies who had no difficulty with antisemitic chants and violence at demonstrations.',
            mapTagline: 'Global Diaspora',
            timelineTagline: 'From Antiquity to Modern Era',
            timelineIntro: 'Jewish history spans from the patriarchs of ancient Canaan to the rebirth of a state in 1948 and beyond. This timeline covers the major eras — biblical, classical, medieval, modern — and the events that shaped both Jews and the world.',
            aboutTagline: 'A Comprehensive Exploration',
            aboutIntro: 'This website serves as a comprehensive resource exploring Jewish civilization — from its ancient origins to the vibrant communities of today.',
            aboutMissionTitle: 'Our Mission',
            aboutMissionText: 'To provide an accessible, comprehensive overview of Jewish civilization—from biblical origins to contemporary life—that is educational, balanced, and respectful.',
            aboutPerspectiveTitle: 'Global Perspective',
            aboutPerspectiveText: 'Jewish communities have existed on every continent for millennia. This site aims to represent the full diversity of Jewish experience — Ashkenazi, Sephardic, Mizrahi, Ethiopian, Indian, and more.',
            aboutCultureTitle: 'Culture & Continuity',
            aboutCultureText: 'Jewish culture has survived exile, persecution, and dispersal through literature, law, language, and memory. This site documents that extraordinary chain of continuity.',
            aboutIssuesTitle: 'Contemporary Issues',
            aboutIssuesText: 'The site addresses antisemitism, Israel, and the complex politics of Jewish identity in the modern world — with nuance, honesty, and a commitment to truth over comfort.'
        },
        nl: {
            siteName: '<span class="brand-star"><svg class="logo-image-png" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="42" height="42" aria-hidden="true" role="img" aria-label="Magen David"><polygon points="60,10 103.3,85 16.7,85" fill="none" stroke="#000000" stroke-width="7"/><polygon points="60,110 16.7,35 103.3,35" fill="none" stroke="#000000" stroke-width="7"/></svg></span><span class="brand-wordmark">Iets<br>Joods</span>',
            navPeople: 'Volk',
            navReligion: 'Religie',
            navCultureGroup: 'Cultuur',
            navScience: 'Wetenschap',
            navAntisemitism: 'Antisemitisme',
            navTimeline: 'Tijdlijn',
            navMap: 'Kaart',
            navIsraelGroup: 'Israël',
            navAbout: 'Over',
            navSub: {
                'history-timeline': [{ id: 'history-timeline', i18n: 'navTimeline' }],
                'diaspora-map': [{ id: 'diaspora-map', i18n: 'navMap' }],
                'israel': [
                    { id: 'facts', i18n: 'israelFacts' },
                    { id: 'indigenous', i18n: 'israelIndigenous' },
                    { id: 'demographics', i18n: 'israelDemographics' },
                    { id: 'myths', i18n: 'israelMyths' },
                    { id: 'israel-region', i18n: 'israelRegion' },
                    { id: 'israel-democracy', i18n: 'israelDemocracy' },
                    { id: 'israel-antisemitism', i18n: 'israelAntisemitism' },
                    { id: 'israel-voices', i18n: 'israelVoices' },
                    { id: 'israel-criticism', i18n: 'israelCriticism' }
                ],
                'about': [{ id: 'about', i18n: 'navAbout' }]
            },
            footerNavigate: 'Navigeren',
            footerExplore: 'Ontdekken',
            footerSeeFurther: 'Zie verder op:',
            footerBackToTop: 'Terug naar boven',
            footerBrandTitle: 'De Joodse Wereld',
            footerBrandText: 'Een uitgebreide verkenning van de Joodse geschiedenis, gemeenschappen en identiteit.',
            footerAllRightsReserved: '© 2026 - Alle rechten voorbehouden',
            heroLabel: '3.000 jaar geschiedenis',
            heroTitle: 'Iets <em>Joods</em>',
            heroSubtitle: 'Van oude koninkrijken tot wereldwijde diaspora — een uitgebreide verkenning van de Joodse geschiedenis, gemeenschappen, cultuur en identiteit door de eeuwen heen.',
            heroCta: 'Begin met lezen →',
            whoisajewSub: 'Wie is een Jood?', whoisajewTagline: 'Een geloof of een volk?',
            apeopleSub: 'Tussen de naties', apeopleTagline: 'Diaspora & Gemeenschappen',
            cohenSub: 'Cohen', cohenTagline: 'Genealogie & Priesterlijke Code',
            rottenapplesSub: 'Rotte appels', rottenapplesTagline: 'Ethiek',
            contemporarySub: 'Vandaag de dag', contemporaryTagline: 'Joods leven in de 21e eeuw',
            religionSub: 'In den Beginne...', religionTagline: 'Er waren woorden',
            literatureSub: 'literatuur', literatureTagline: 'Het Volk van het Boek',
            artSub: 'Kunst & Design', artTagline: 'Van Tabernakel tot Transcendentie',
            musicSub: 'Muziek', musicTagline: 'Van tempelpsalmen tot moderne pop',
            scienceSub: 'Medicijnen & Technologie', scienceTagline: 'Kennis & Ontdekking',
            antisemitismSub: 'Eeuwenoude haat in moderne vormen', antisemitismTagline: 'Donkere stromingen',
            timelineSub: 'Historische tijdlijn', timelineTagline: 'Van de oudheid tot de moderne tijd',
            mapSub: 'Joodse gemeenschappen over de wereld', mapTagline: 'Wereldwijde diaspora',
            aboutSub: 'Something Jewish', aboutTagline: 'Een uitgebreide verkenning',

            // People Section Content (NL)
            peopleSectionTitle: 'Een zegen of een vloek?',
            peopleSectionIntro: 'Vier invalshoeken op het Joodse volk — klik op een om te openen.',
            peopleAshkenaziTitle: 'Asjkenazische Joden',
            peopleAshkenaziText: '<strong>Centraal- & Oost-Europa.</strong> Nakomelingen van middeleeuwse Rijnlandse gemeenschappen die zich uitbreidden naar Polen, Litouwen en Rusland. Tegen 1900 vormden zij ~90% van de wereldwijde Joodse bevolking. Taal: Jiddisch. Cultuur: Chassidische beweging, Klezmer, jesjiva-tradities. ~11 miljoen vandaag.',
            peopleSephardicTitle: 'Sefardische Joden',
            peopleSephardicText: '<strong>Sefardische diaspora (Spanje & Portugal).</strong> Verdreven uit het Iberisch schiereiland in 1492, verspreid naar het Ottomaanse Rijk, Noord-Afrika, Amsterdam en Amerika. Taal: Ladino (Judeo-Spaans). De Sefardische rite verschilt in gebed en praktijk. ~1-2 miljoen vandaag.',
            peopleMizrahiTitle: 'Mizrahi Joden',
            peopleMizrahiText: '<strong>Midden-Oosten & Noord-Afrika.</strong> Inheemse gemeenschappen die dateren van vóór de Arabische verovering — zij zijn nooit door de Europese diaspora gegaan. Talen: Judeo-Arabisch, Judeo-Perzisch, Aramees. Kenmerkende culinaire en gebedstradities. ~4-5 miljoen vandaag.',
            peopleYemeniteTitle: 'Jemenitische Joden',
            peopleYemeniteText: '<strong>Arabië — mogelijk al sinds Salomo.</strong> Een van de oudste en meest geïsoleerde gemeenschappen. Unieke Thora-lezing, handgeschreven rollen, zilverwerk. Operatie Magic Carpet (1949–50) bracht bijna de gehele gemeenschap per vliegtuig naar Israël. ~400.000 vandaag.',
            peopleIraqiTitle: 'Iraakse / Babylonische Joden',
            peopleIraqiText: '<strong>Mesopotamië — oudste continue gemeenschap sinds 586 v.Chr.</strong> Brachten de Babylonische Talmoed voort (de meest gezaghebbende rabbijnse tekst). Bagdad was in 1900 voor 1/3 Joods. De meesten emigreerden na 1948 naar Israël. ~200.000 vandaag.',
            peopleChineseTitle: 'Chinese Joden',
            peopleChineseText: '<strong>Kaifeng & Shanghai.</strong> De Kaifeng-gemeenschap stamt af van handelaren van de Zijderoute. Shanghai werd een toevluchtsoord voor Europese Joden die vluchtten voor de Holocaust. Een opmerkelijk voorbeeld van de Joodse diaspora in het Verre Oosten. Zeer klein vandaag, maar historisch belangrijk.',
            peopleLatAmTitle: 'Latijns-Amerikaanse Joden',
            peopleLatAmText: '<strong>Argentinië, Brazilië, Mexico.</strong> Argentinië (~200k) is de grootste gemeenschap in de regio. Gevormd door 19e-20e-eeuwse migratie. Integratie in de lokale cultuur met behoud van de Joodse identiteit.',
            peopleMountainTitle: 'Bergjoden (Juhuro)',
            peopleMountainText: '<strong>Kaukasus (Azerbeidzjan, Dagestan).</strong> Afstammelingen van Perzische Joden die zich in de 5e eeuw in de bergen vestigden. Unieke taal: Juhuri (Judeo-Tat). Rijke traditie van vakmanschap en kenmerkende liturgie.',
            peopleItalkimTitle: 'Italkim (Italiaanse Joden)',
            peopleItalkimText: '<strong>Italië — sinds de Romeinse Republiek.</strong> Een van de oudste continue gemeenschappen in Europa. Noch Asjkenazisch noch Sefardisch, zij handhaven de unieke "Nusach Italki" (Italiaanse rite). Centra: Rome, Venetië, Florence.',
            peopleBetaIsraelTitle: 'Beta Israel (Ethiopische Joden)',
            peopleBetaIsraelText: '<strong>Ethiopië — beoefende geïsoleerd jodendom gedurende 2.000 jaar.</strong> Herleid tot de koningin van Sheba en koning Salomo. Behoud van oude Thora (Orit). De meesten werden in de jaren 80-90 naar Israël overgebracht. ~160.000 vandaag.',
            peopleIndianTitle: 'Indiase Joden',
            peopleIndianText: '<strong>Bene Israel, Cochin, Baghdadi Joden.</strong> Kwamen in golven aan over 2.000 jaar. Bloeiden in een cultuur van religieuze tolerantie. Centra: Mumbai, Kochi, Kolkata. De meesten emigreerden na 1948 naar Israël.',
            peopleSamaritanTitle: 'Samaritanen (Shomronim)',
            peopleSamaritanText: '<strong>Mount Gerizim & Holon.</strong> Strikt genomen geen "Joden" in de rabbijnse zin, maar delen een gemeenschappelijke Israëlitische afkomst. Volgen alleen de Thora (Pentateuch). Oude, hechte gemeenschap van ~800 mensen.',

            // Religion Section Content (NL)
            religionIntro: 'Het jodendom begint met tekst, maar niet met tekst alleen. Bijbel, rabbijnse discussie, juridische interpretatie, poëzie, volksverhalen en mystiek commentaar vormen een gelaagde traditie waarin lezen zelf een religieuze handeling is.',
            sacredTanakhTorahTitle: 'De Bijbel',
            sacredTanakhTorahText: 'De Tenach is de Hebreeuwse Bijbel, bestaande uit Thora (Wet), Nevi\'im (Profeten) en Ketuvim (Geschriften). De Thora, de vijf boeken van Mozes, vormt de basis van de Joodse wet, geschiedenis en identiteit.',
            sacredTalmudTitle: 'Talmoed',
            sacredTalmudText: 'De Talmoed is het grote verslag van rabbijnse discussie: Misjna plus Gemara. Hij vertaalt bijbelse wet naar geleefde praktijk via debat, precedent, verhalen, minderheidsmeningen en juridisch redeneren.',
            sacredZoharTitle: 'Zohar',
            sacredZoharText: 'De Zohar is het centrale werk van de Kabbala, waarin de Thora wordt gelezen als een symbolische kaart van goddelijke emanaties, verborgen betekenissen, spiritueel herstel en het innerlijke leven van de schepping.',
            authorshipDatingHeading: 'AUTEURSCHAP EN DATERING',
            sacredChaptersTitle: 'Een Kleine Kaart van de Bibliotheek',
            sacredChaptersIntro: 'De Joodse bibliotheek is geen enkel boek in een rechte lijn. Zij is een gesprek tussen wet, verhaal, profetie, poëzie, wijsheid, discussie en mystieke verbeelding.',
            chapPentateuchTitle: 'Pentateuch',
            chapPentateuchText: 'De Griekse naam voor de vijf boeken van de Thora; in het Joodse leven simpelweg Thora.',
            chapGenesisTitle: 'Genesis',
            chapGenesisText: 'Schepping, verbond, familieconflict, Abraham en Sara, Jakob, Jozef en de afdaling naar Egypte.',
            chapExodusTitle: 'Exodus',
            chapExodusText: 'Slavernij, bevrijding, Sinaï, wet, woestijn en de politieke geboorte van Israël als volk.',
            chapPsalmsTitle: 'Psalmen',
            chapPsalmsText: 'Gebedspoëzie voor angst, verdriet, dankbaarheid, koningschap, ballingschap en lof.',
            chapJobTitle: 'Job',
            chapJobText: 'Een felle discussie over lijden, onschuld, goddelijke rechtvaardigheid en de grenzen van verklaring.',
            chapJonahTitle: 'Jona',
            chapJonahText: 'Een compact profetisch verhaal over ontwijking, barmhartigheid, bekering en wrok.',
            chapEcclesiastesTitle: 'Prediker',
            chapEcclesiastesText: 'Wijsheidsliteratuur over ijdelheid, sterfelijkheid, werk, genot en de zoektocht naar betekenis.',
            chapTalmudTitle: 'Talmoedische Pagina\'s',
            chapTalmudText: 'Geen hoofdstukken maar gelaagde pagina\'s: wet, verhaal, vraag, antwoord, bezwaar en tegenbezwaar.',
            sacredTimingTitle: 'Datering & Auteurschap',
            sacredTimingIntro: 'Joodse traditie en moderne wetenschap beantwoorden de vraag naar auteurschap verschillend. Traditie spreekt vaak in termen van openbaring en genoemde profeten of wijzen; academisch onderzoek ziet meestal lange processen van compositie, redactie, overdracht en canonvorming.',
            timingTanakhTorahTitle: 'Auteurschap & Canonisatie',
            timingTanakhTorahText: 'De Thora werd traditioneel geopenbaard op de Sinaï; academische studie ziet een lang proces van compilatie (10e-5e eeuw v.Chr.). De Profeten en Geschriften werden over meerdere eeuwen gecanoniseerd, waarbij de volledige Tenach zijn definitieve vorm bereikte in de late Tweede Tempelperiode.<br><br>De Misjna werd rond 200 n.Chr. samengesteld, traditioneel verbonden met rabbi Jehoeda ha-Nasi. De Jeruzalemse en Babylonische Talmoed groeiden in de eeuwen daarna, waarbij de Babylonische Talmoed grotendeels rond 500 n.Chr. werd voltooid.<br><br>De traditie schrijft de Zohar toe aan de 2e-eeuwse wijze Shimon bar Yochai. De meeste academische onderzoekers dateren de hoofdcompositie in 13e-eeuws Spanje, vooral rond Mozes de León, met erkenning van oudere mystieke wortels.',
            timingWisdomTitle: 'Wijsheid & Verhaal',
            timingWisdomText: 'Job, Jona, Ruth, Esther en Prediker worden meestal gelezen als literair-theologische werken met onzeker auteurschap. Hun kracht ligt minder in een bekende auteur dan in de vragen die zij opvoeren.',
            timingTalmudTitle: 'Misjna & Talmoed',
            timingTalmudText: 'De Misjna werd rond 200 n.Chr. samengesteld, traditioneel verbonden met rabbi Jehoeda ha-Nasi. De Jeruzalemse en Babylonische Talmoed groeiden in de eeuwen daarna, waarbij de Babylonische Talmoed grotendeels rond 500 n.Chr. werd voltooid.',
            timingZoharTitle: 'Zohar',
            timingZoharText: 'De traditie schrijft de Zohar toe aan de 2e-eeuwse wijze Shimon bar Yochai. De meeste academische onderzoekers dateren de hoofdcompositie in 13e-eeuws Spanje, vooral rond Mozes de León, met erkenning van oudere mystieke wortels.',
            ritualsTitle: 'Rituelen, Vieringen, Feestdagen & Termen',
            ritualsIntro: 'Joodse tijd wordt gevormd door wekelijkse rust, seizoensfeesten, vastendagen, levenscyclusrituelen, eetpraktijken en woorden die eeuwen aan herinnering dragen door talen en gemeenschappen heen.',
            ritualShabbatTitle: 'Sjabbat (Sjabbes)',
            ritualShabbatText: 'De wekelijkse sabbat, van vrijdagavond tot zaterdagavond: kaarsen, kiddush, challah, rust, gebed, familiemaaltijden en een bewuste pauze van alledaags werk.',
            ritualPesachTitle: 'Pesach',
            ritualPesachText: 'Het lentefeest van bevrijding uit Egypte. De sedermaaltijd vertelt Exodus opnieuw via matse, bittere kruiden, wijn, vragen, liederen en symbolisch eten.',
            ritualPurimTitle: 'Poerim',
            ritualPurimText: 'Een vrolijke feestdag rond het Boek Esther: megillah lezen, kostuums, liefdadigheid, voedselgeschenken, lawaai voor Haman en een carnavaleske sfeer.',
            ritualRoshHashanahTitle: 'Rosj Hasjana',
            ritualRoshHashanahText: 'Het Joodse Nieuwjaar en het begin van de Hoge Feestdagen. Gemarkeerd door de sjofar, gebed, zelfonderzoek, appel met honing en hoop op een zoet jaar.',
            ritualYomKippurTitle: 'Jom Kippoer',
            ritualYomKippurText: 'Grote Verzoendag, de plechtigste dag van de Joodse kalender: vasten, belijdenis, vergeving, herstel en de afsluitende Neilah-dienst.',
            ritualSukkotTitle: 'Soekot',
            ritualSukkotText: 'Het oogstfeest van loofhutten, dat herinnert aan de woestijntocht. Families eten in een soeka en zwaaien met loelav en etrog.',
            ritualHanukkahTitle: 'Chanoeka',
            ritualHanukkahText: 'Een achtdaags winterfeest ter herinnering aan de Makkabese opstand en herinwijding van de Tempel, met het aansteken van de chanoekia, liederen, spelletjes en gefrituurd eten.',
            ritualKashrutTitle: 'Kasjroet',
            ritualKashrutText: 'Joodse spijswetten: koosjere en niet-koosjere dieren, scheiding van vlees en melk, rituele slacht en dagelijkse discipline rond eten.',
            ritualMitzvahTitle: 'Mitswa',
            ritualMitzvahText: 'Een gebod of heilige verplichting. In alledaagse taal kan het ook een goede daad betekenen, maar de wortelbetekenis is verbondsverantwoordelijkheid.',
            ritualBarBatTitle: 'Bar / Bat Mitswa',
            ritualBarBatText: 'Het volwassenwordingsmoment waarop een jonge Jood verantwoordelijk wordt voor mitswot, vaak gemarkeerd door Thora-lezing, gebedsleiding, studie en feest.',
            ritualBritTitle: 'Brit Milah',
            ritualBritText: 'Het verbond van besnijdenis, traditioneel uitgevoerd op de achtste dag bij Joodse jongens, als verbinding tussen familie, lichaam, afkomst en verbond.',
            ritualTzedakahTitle: 'Tsedaka',
            ritualTzedakahText: 'Vaak vertaald als liefdadigheid, maar dichter bij rechtvaardigheid of verplichting: geven omdat gemeenschap en kwetsbaren aanspraak op ons hebben.',
            religionMovementsTitle: 'Stromingen & Praktijk',
            religionMovementsIntro: 'Door geografie en geschiedenis ontwikkelden Joden verschillende interpretaties van de Thora, liturgische praktijken en niveaus van observantie. Van orthodoxie tot reform, van chassidische mystiek tot seculier humanisme: Joods religieus leven bestrijkt een breed spectrum.',
            religionOrthodox_Title: 'Orthodox',
            religionOrthodox_Text: 'Legt de nadruk op strikte naleving van de Thora en de Talmoedische wetgeving. Subdivisies zijn onder meer Charedisch (ultra-orthodox), Modern-Orthodox en Chassidische bewegingen. Handhaaft traditionele genderrollen, spijswetten (kasjroet), sabbatsviering en de studie van heilige teksten.',
            religionConservative_Title: 'Conservatief',
            religionConservative_Text: 'Zoekt een balans tussen de traditionele Joodse wet en het moderne leven. Ontstaan in het 19e-eeuwse Duitsland; sterk vertegenwoordigd in Amerika. Staat rabbijnse flexibiliteit in interpretatie toe terwijl de kernwaarden behouden blijven. Wordt in Israël vaak \'Masorti\' (traditioneel) genoemd.',
            religionReform_Title: 'Reform',
            religionReform_Text: 'Legt de nadruk op ethisch monotheïsme en persoonlijke interpretatie van de Thora. Begon in het begin van de 19e eeuw in Europa; de meest liberale stroming. Vrouwen en LHBTIQ+ personen zijn volledig opgenomen in het religieuze leven. Focus op universele waarden en sociale rechtvaardigheid.',
            religionReconstructionist_Title: 'Reconstructionistisch',
            religionReconstructionist_Text: 'Beschouwt het jodendom als een evoluerende beschaving, niet als geopenbaarde wet. Legt de nadruk op gemeenschap, creativiteit en democratische besluitvorming in spirituele zaken. Integreerde al vroeg het Joods feminisme en was een pionier in egalitaire diensten.',
            religionHasidic_Title: 'Chassidisch',
            religionHasidic_Text: 'Een extatische, mystieke beweging gesticht in het 18e-eeuwse Oost-Europa door de Ba\'al Sjem Tov. Legt de nadruk op vreugde, spirituele verheffing via gebed en zang, en eerbied voor een tzaddik (heilige leider). Bloeit nog steeds in geïsoleerde gemeenschappen wereldwijd.',
            religionSecular_Title: 'Seculier',
            religionSecular_Text: 'Veel Joden zijn seculier of cultureel — zij identificeren zich als Joods via etniciteit, geschiedenis en sociale/ethische betrokkenheid in plaats van religieuze overtuiging. Ondersteunt Joodse continuïteit via taal (Jiddisch, Hebreeuws), kunst, activisme en gemeenschap, in plaats van theologie.',
            religionNeturei_Title: 'Neturei Karta',
            religionNeturei_Text: 'Een ultraorthodoxe groepering die bekend staat om hun felle tegenstand tegen het zionisme en de staat Israël op religieuze gronden. Zij geloven dat een Joodse staat alleen door de Messias kan worden gesticht.',
            religionOrthodox_Tagline: 'Eeuwenoude wet & modern leven',
            religionConservative_Tagline: 'Traditie & Verandering',
            religionReform_Tagline: 'Vooruitgang & Inclusie',
            religionReconstructionist_Tagline: 'Evoluerende Beschaving',
            religionSecular_Tagline: 'Cultuur & Identiteit',
            religionNeturei_Tagline: 'Wachters van de Stad',
            cohenText1: 'De naam Cohen (of Kahn, Cohn, Kahanoff, enz.) vertegenwoordigt een van \'s werelds grootste uitgebreide families — allemaal afstammelingen van de oude Joodse priesterklasse en specifiek van Aäron, de broer van Mozes. In de bijbelse tijd dienden de Kohaniem (priesters) in de Tempel en hadden zij heilige taken. Na de verwoesting van de Tempel in 70 n.Chr. verloren zij hun priesterlijke functies, maar de genealogische lijn bleef bestaan.',
            cohenPoint1Title: 'De Priestercode',
            cohenPoint1Text: 'Kohaniem hadden het exclusieve recht om Tempeloffers, zegeningen en heilige rituelen uit te voeren. Hun ceremoniële rol eindigde met de verwoesting van de Tempel, maar hun culturele status bleef bestaan.',
            cohenPoint2Title: 'Genetische Erfenis',
            cohenPoint2Text: 'Het \'Cohen Modal Haplotype\' (een specifiek DNA-patroon) komt voor bij ~55% van de mannen met de achternaam Cohen, maar is zeldzaam in de algemene bevolking — een sterk bewijs van patrilineaire afstamming van de oude priesters.',
            cohenPoint3Title: 'Wereldwijde Cohens Vandaag',
            cohenPoint3Text: 'Van Leonard Cohen (musicus) tot Sacha Baron Cohen (acteur) tot talloze wetenschappers en kunstenaars — de naam Cohen overspant elk continent en beroep, verenigd door een eeuwenoude genealogie.',
            financeIntro1: 'De Joodse betrokkenheid bij financiën heeft diepe historische wortels — van middeleeuwse geldverstrekkers (door christelijke beperkingen in de financiële sector gedreven) tot moderne bankiersdynastieën. De Rothschilds, Goldman Sachs en talloze Joodse financiers gaven vorm aan het kapitalisme. Deze realiteit heeft eeuwenlang antisemitische complottheorieën gevoed.',
            financeIntro2: '<strong>Het fenomeen van de "foute Joden":</strong> De term ontstond om Joden te beschrijven die de gemeenschapsnormen schonden of zich onethisch gedroegen. Dit omvat onder meer:',
            financePoint1Title: 'Financiële Schandalen',
            financePoint1Text: 'Bernie Madoffs Ponzi-fraude van $65 miljard ruïneerde veel Joodse goede doelen. Zijn identiteit als een \'insider\' maakte het verraad extra pijnlijk binnen de gemeenschap. De instorting van FTX door Sam Bankman-Fried wakkerde later dezelfde vragen aan over rijkdom, vertrouwen en gemeenschappelijke verantwoordelijkheid.',
            financePoint4Title: 'Machtsmisbruikers',
            financePoint4Text: 'Harvey Weinstein en Jeffrey Epstein waren niet zozeer financiële schandalen, maar voorbeelden van misbruik van status, toegang, stilte en bescherming. Ze horen hier omdat ze laten zien hoe prestige als dekmantel kan werken, en hoe gemeenschappen wangedrag onder ogen moeten zien zonder defensief te worden.',
            financePoint5Title: 'Waar Vluchtten Ze Heen?',
            financePoint5Text: 'Ze ontsnapten niet naar een verborgen gemeenschappelijke schuilplaats. Madoff stierf in de federale gevangenis; Weinstein werd veroordeeld en opgesloten; Epstein stierf in de cel in afwachting van zijn federale proces; Bankman-Fried werd veroordeeld tot gevangenisstraf. Het punt is verantwoordelijkheid, niet collectieve schuld.',
            contemporaryIntro: 'De Joden van vandaag vormen een wereldwijde diaspora, beïnvloed door internet, migratie, intermarriage en diverse geloofsvormen. Geografische en culturele gemeenschappen bloeien voort terwijl nieuwe vormen van joodse identiteit ontstaan.',
            scienceIntro: 'Joodse denkers hebben wiskunde, fysica, geneeskunde, informatica en meer vooruitgestuwd—vaak met wereldwijde impact terwijl zij ook culturele en politieke uitdagingen trotseren.',
            antisemitismIntro: 'Antisemitisme is de oudste haat ter wereld. Het heeft zich ontwikkeld van religieuze vervolging tot raciale pseudowetenschap en moderne complottheorieën. In de 21e eeuw blijft het bestaan in radicale vormen.',

            // Antisemitism Content (NL)
            anti911Title: '9/11 als Keerpunt (2001)', anti911Text: 'De aanslagen van Al-Qaeda veranderden het mondiale terrorisme.',
            antiEuropeanTitle: 'Europese Moordaanslagen (2002-2004)', antiEuropeanText: 'De moorden op Pim Fortuyn (2002) en Theo van Gogh (2004) legden de spanningen in Nederland bloot.',
            antiWaveTitle: 'Terreurgolf in Europa (2004-2017)', antiWaveText: 'Een reeks aanslagen in Europese steden bevatte antisemitische retoriek.',
            antiCampusTitle: 'Campus Antisemitisme & BDS', antiCampusText: 'De BDS-beweging vervalt vaak in antisemitisme.',
            antiSocialMediaTitle: 'Sociale Media & Viraal Antisemitisme', antiSocialMediaText: 'Online platforms versterken eeuwenoude stereotypen.',
            antiOct7Title: 'Nasleep 7 Oktober', antiOct7Intro: 'Antisemitische incidenten bereikten een historisch dieptepunt na de aanval van Hamas.',
            antiOct7SurgeTitle: 'Explosieve Stijging', antiOct7SurgeText: 'Nederland, Frankrijk en de VS rapporteerden recordaantallen incidenten.',
            antiOct7CampusTitle: 'Chaos op Campussen', antiOct7CampusText: 'Joodse studenten vrezen voor hun veiligheid.',
            antiOct7StreetTitle: 'Straatintimidatie', antiOct7StreetText: 'Zichtbaar Joodse symbolen leiden wereldwijd tot meer geweld.',
            antiOct7AllianceTitle: 'Alliantie Links-Islamisme', antiOct7AllianceText: 'Politieke coalities tussen progressieven en islamisten framen Joden als "onderdrukkers."',
            antiOct7FracturesTitle: 'Breuklijnen in de Diaspora', antiOct7FracturesText: 'Ongekende polarisatie binnen de Joodse gemeenschap.',
            antiModernTitle: 'Modern Antisemitisme: Kernkenmerken',
            antiModernAntiZionism: '<strong>Gereinstrumentaliseerd Anti-Zionisme:</strong> Ontkenning van Joodse zelfbeschikking.',
            antiModernConspiracy: '<strong>Complottheorieën:</strong> Joden de schuld geven van geweld tegen henzelf.',
            antiModernReligion: '<strong>Religieus Antisemitisme:</strong> Radicale interpretaties gebruikt voor propaganda.',
            antiModernDiaspora: '<strong>Kwetsbaarheid van de Diaspora:</strong> Joden wereldwijd worden collectief verantwoordelijk gehouden.',
            antiModernIntersectionality: '<strong>Intersectionality Weaponized:</strong> Joden positioneren als "bevoorrecht" om uitsluiting te rechtvaardigen.',

            // Map & Footer (NL)
            mapIntro: 'Een visueel overzicht van de belangrijkste Joodse gemeenschappen door de geschiedenis heen en over de hele wereld.',
            mapInstruction: 'Beweeg over regio\'s voor een voorproefje, klik voor volledige details.',
            israelFacts: 'Kernfeiten',
            israelIndigenous: 'Inheems',
            israelDemographics: 'Demografie',
            israelMyths: 'Mythen',
            israelRegion: 'Regio',
            israelDemocracy: 'Democratie',
            israelAntisemitism: 'Anti-zionisme',
            israelVoices: 'Stemmen',
            israelCriticism: 'Kritiek',

            // Religion — Attire subsection (NL)
            relAttireTitle: 'Kledij & Religieuze Kleding',
            relAttireIntro: 'Joodse kledingcodes variëren sterk per gemeenschap, observatieniveau en traditie — van nauwelijks zichtbaar tot onmiddellijk herkenbaar.',
            relKippahTitle: 'Kipa (Jarmulke)',
            relKippahText: 'Een klein hoofddeksel dat Joodse mannen dragen als teken van eerbied voor God. De stijl varieert sterk: gebreid (srugah) bij Modern-Orthodox en Religieus-Zionistische mannen; effen zwart fluweel bij Charedisch Orthodox; suède of leer bij veel traditionele Joden. Gedragen de hele dag door de vrome, alleen tijdens gebed door anderen — of helemaal niet.',
            relPeyotTitle: 'Peyot (Slokken)',
            relPeyotText: 'Lange, ongeknipte sluiken die door veel orthodoxe en chassidische Joodse mannen worden gedragen, gebaseerd op het bijbelse verbod om "de hoeken van het hoofd af te ronden" (Leviticus 19:27). De stijl varieert van korte krullen achter het oor tot dramatisch lange, spiraalvormige lokken vóór het gezicht. Bijzonder prominent bij Jemenitische en chassidische Joden.',
            relShtreibelTitle: 'Shtreimel & Spodik',
            relShtreibelText: 'Grote, ronde bonthoeden gedragen door gehuwde chassidische mannen op sjabbat en Joodse feestdagen. De shtreimel (platte, brede rand van sabelbont) is verbonden met Poolse en Galicische chassidische hoven; de spodik (hoog en cilindrisch) met Litouwse en Poolse chassidim. Deze hoeden waren oorspronkelijk 18e-eeuwse Oost-Europese aristocratische kleding, overgenomen als feestelijke Joodse dracht.',
            relTzitzitTitle: 'Tzitzit (Franjes)',
            relTzitzitText: 'Geknoopte franjes bevestigd aan de vier hoeken van een kledingstuk, voorgeschreven in Numeri 15:38–40. Overdag gedragen als tallit katan (klein gebedsmantel) door vrome mannen; soms bewust zichtbaar hangend onder het shirt. Een volledige tallit (gebedsmantel) met tzitzit wordt gedragen tijdens de ochtendgebedsservices.',
            relTzniutTitle: 'Tzniut (Bescheiden Kleding)',
            relTzniutText: 'Het concept van bescheidenheid (tzniut) regelt kledingstandaarden in vrome gemeenschappen, met name voor vrouwen. Dit betekent doorgaans bedekte ellebogen, knieën en sleutelbeen. Gehuwde orthodoxe vrouwen bedekken hun haar met een sheitel (pruik), tichel (hoofddoek) of hoed. In charedische gemeenschappen zijn de normen strenger; in modern-orthodoxe gemeenschappen is er meer variatie. Niet-orthodoxe Joden hanteren doorgaans geen specifieke kledingcodes.',
            relBekkesheTitle: 'Bekishe & Kapote',
            relBekkesheText: 'Lange zwarte jassen gedragen door chassidische mannen, geworteld in 18e-eeuwse Oost-Europese kleding. De bekishe (zijden rok) wordt gedragen op sjabbat en feestdagen; de kapote (een meer alledaagse lange jas) op weekdagen. Witte overhemden, donkere broeken en zwarte schoenen completeren het geheel. Zwart staat niet voor rouw — het weerspiegelt simpelweg de historische kleding van de Poolse adel, bewaard als traditie.',

            // Missing NL keys — added
            whoisajewTagline: 'Een geloof of een volk?',
            whoisajewIntro: 'De vraag "Wie is een Jood?" is een van de meest complexe debatten in de Joodse geschiedenis, waarbij religieuze wet, seculiere identiteit en moderne burgerrechtswetten een rol spelen. Omdat het jodendom een etno-religie is, verschilt de definitie afhankelijk van of je kijkt vanuit een juridisch, religieus of persoonlijk perspectief.',
            whoisajewPoint1Title: 'Traditionele Religieuze Definitie (Halacha)',
            whoisajewPoint1Text: 'Volgens de Halacha (Joodse wet), gevolgd door orthodoxe en conservatieve stromingen, is iemand Joods als zijn of haar moeder Joods was bij de geboorte (matrilineaire afstamming), of als hij of zij een formeel conversieproces heeft doorlopen erkend door een rabbijnse rechtbank (Bet Din).',
            whoisajewPoint2Title: 'Moderne Denominationele Verschuivingen',
            whoisajewPoint2Text: 'In de 20e eeuw werd de definitie verbreed. Reform- en Reconstructionistisch jodendom erkennen patrilineaire afstamming als het kind met een Joodse identiteit is opgevoed. Sommige seculiere Joden definiëren identiteit via cultuur, geschiedenis of etniciteit in plaats van religieuze praktijk.',
            whoisajewPoint3Title: 'Het Seculiere Staatsperspectief (Wet op de Terugkeer)',
            whoisajewPoint3Text: 'De Wet op de Terugkeer van de staat Israël (1950) verleent staatsburgerschap aan iedereen met ten minste één Joodse grootouder of een Joodse echtgeno(o)t(e). Dit beschermt diegenen die te maken hebben met antisemitisme, ook als het Rabbinaat hen niet erkent voor religieuze doeleinden zoals het huwelijk.',
            whoisajewSummary: 'Uiteindelijk is het een spanning tussen Am Yisrael (het Volk van Israël) als biologische familie en Torat Yisrael (de Wet van Israël) als religieus verbond.',
            apeopleTagline: 'Diaspora & Gemeenschappen',
            peopleIntro: 'Joodse identiteit overstijgt geografie. Van het oude Israël tot de moderne diaspora hebben Joden distinctieve gemeenschappen behouden terwijl zij zich over elk continent verspreidden. De grote takken — Asjkenazisch, Sefardisch, Mizrahi en vele anderen — dragen elk unieke tradities, talen en geschiedenissen.',
            cohenTagline: 'Genealogie & Priesterlijke Code',
            rottenapplesTagline: 'Ethiek & "De Joodse Kwestie"',
            contemporaryTagline: 'Joods leven in de 21e eeuw',
            todayPoint1Title: 'Digitale Diaspora',
            todayPoint1Text: 'Het internet heeft een grensloze Joodse gemeenschap gecreëerd. Van digitale jesjiva\'s tot Joodse stamboomgroepen — technologie maakt mondiale verbinding mogelijk en het behoud van zeldzame dialecten zoals Ladino en Jiddisch.',
            todayPoint2Title: 'Interfaith & Diversiteit',
            todayPoint2Text: 'Stijgende percentages gemengde huwelijken en de opname van diverse stemmen (LGBTQ+, Joden van kleur) herdefiniëren wat het betekent een Joods gezin te zijn. Pluralisme wordt het kenmerk van de 21e-eeuwse diaspora.',
            todayPoint3Title: 'Revitalisering',
            todayPoint3Text: 'Een nieuwe generatie herontdekt oude tradities — via eten, kunst en milieuactivisme (Eco-jodendom). Deze "Nieuwe Jood"-beweging combineert erfgoed met progressieve waarden.',
            religionTagline: 'Er waren woorden',
            financePoint2Title: 'Ethische Spanningen',
            financePoint2Text: 'De spanning tussen religieus recht (Halacha) en moderne bedrijfsethiek is een voortdurend gesprek. Figuren als Sam Bankman-Fried (FTX) hebben de debatten over ethiek, rijkdom en gemeenschappelijke verantwoordelijkheid in de 21e eeuw opnieuw aangewakkerd.',
            financePoint3Title: 'Controversiële Figuren',
            financePoint3Text: 'Van figuren als Roy Cohn (politieke fixer) tot moderne controversiële miljardairs — de handelingen van prominente Joden worden vaak intensief bestudeerd, zowel vanuit de gemeenschap als daarbuiten, wat de last van representatie benadrukt.',
            literatureSubTitle: 'Het Volk van het Boek',
            literatureIntro: 'Joodse literatuur omvat heilige teksten, Talmoedische debatten, mystische poëzie, seculier modernisme en hedendaagse fictie. Van de verhalende cycli van Genesis en Exodus in de Hebreeuwse Bijbel (Tenach) tot 21e-eeuwse romanschrijvers: Joden zijn altijd bezeten geweest van interpretatie, verhalen vertellen en ethisch onderzoek.',
            litTanakhTitle: 'De Bijbel',
            litTanakhText: 'De Hebreeuwse Bijbel (Tenach) is een verzameling van 39 boeken die wetten, profetieën, geschiedenis en poëzie omvat. Geschreven over een millennium vormt het de basis van de Joodse wet, ethiek en verhalende identiteit.',
            litTalmudTitle: 'De Talmoed',
            litTalmudText: 'Omvangrijke verzameling rabbijns debat (ca. 200–500 n.Chr.) over Thorainterpretatie. Twee versies: Bavli (Babylonisch — gezaghebbend) en Yerushalmi (Jeruzalem). Middelpunt van het Joodse leren gedurende 1500+ jaar. Ingewikkeld, dialectisch redeneren over recht en ethiek.',
            litZoharTitle: 'De Zohar & Kabbala',
            litZoharText: 'Middeleeuwse mystieke teksten die de Thora interpreteren via esoterische symbolen en goddelijke emanaties. De Zohar (13e eeuw, Spanje/Provence) is het hoofdwerk. Kabbala benadrukt verborgen betekenissen, meditatie en de mystieke namen van God. Diepgaande invloed op de Joodse spiritualiteit.',
            litPotokTitle: 'Chaim Potok',
            litPotokText: '20e-eeuwse Amerikaans-Joodse romanschrijver. <em>The Chosen</em>, <em>My Name Is Asher Lev</em> — verkennen identiteit, geloof, kunst en moderniteit binnen orthodoxe gemeenschappen. Toegankelijke, diep humanistische verkenning van het Joodse innerlijke leven.',
            litSingerTitle: 'Isaac Bashevis Singer',
            litSingerText: 'Jiddische romanschrijver (1902–1991). Won de Nobelprijs voor Literatuur. <em>The Family Moskat</em>, <em>Shadows on the Hudson</em> — levendige beeldvormingen van het Poolse Joodse sjtetlleven, mystiek en de Amerikaans-immigrantenervaring. Meester in bovennatuurlijk en filosofisch vertellen.',
            litRothTitle: 'Philip Roth',
            litRothText: 'Amerikaans meester van realisme en postmodernisme. <em>Portnoy\'s Complaint</em>, <em>Sabbath\'s Theater</em>. Verkent Joodse identiteit, seksualiteit, Amerikaanse ambitie en de spanning tussen traditie en verlangen. Controversieel, briljant.',
            litKeretTitle: 'Etgar Keret',
            litKeretText: 'Israëlisch hedendaags meester van het korte verhaal. Minimalistisch, donker komisch, diepzinnig. Vangt het moderne Israëlische leven, oorlog, vervreemding en liefde. Verfilmbaar. <em>Suddenly, a Knock on the Door</em>. Stem van de 21e-eeuwse Hebreeuwse literatuur.',
            litOzTitle: 'Amos Oz',
            litOzText: 'Israëlische literaire grootheid (1939–2018). <em>A Tale of Love and Darkness</em>, <em>My Michael</em>. Verkende de Israëlische identiteit, kibbutzleven, Arabisch-Joodse relaties en de menselijke conditie. Nobelprijskandidaat. Diepgaande invloed op de Hebreeuwse literatuur en het Israëlische intellectuele discours.',
            litAleichemTitle: 'Sholem Aleichem & I.L. Peretz',
            litAleichemText: 'Jiddische literaire giganten uit Oost-Europa (eind 1800s). Beeldden het sjtetlleven af met humor, pathos en sociale kritiek. <em>Tevye de melkboer</em> (basis van <em>Fiddler on the Roof</em>). Bewaarden een verdwenen wereld in de literatuur.',
            artSubTitle: 'Van Tabernakel tot Transcendentie',
            artIntro: 'Het jodendom ontmoedigde historisch gezien representatieve kunst (om afgoderij te vermijden), maar Joodse kunstenaars zijn uitgegroeid tot titanen van het modernisme, surrealisme, abstracte kunst en hedendaagse praktijk. De 20e eeuw ontketende Joods creatief genie over alle visuele media.',
            artChagallTitle: 'Marc Chagall',
            artChagallText: 'Geboren in Vitebsk (1887–1985). Dromerige doeken die Joodse folklore, sjtetlherinneringen en surrealistische kleur samensmelten. <em>I and the Village</em>, <em>The Birthday</em>. Bijbelse thema\'s, zwevende figuren, geiten en violisten. De meest "Joodse" schilder van de 20e eeuw.',
            artRothkoTitle: 'Mark Rothko',
            artRothkoText: 'Lets-geboren abstract expressionist (1903–1970). Grote kleurveld-schilderijen van bijna religieuze intensiteit. Verwierp het narratieve ten gunste van pure emotie. Zijn Seagram-muurschilderingen en de Rothko-kapel vertegenwoordigen het sublieme in de moderne kunst.',
            artDesignTitle: 'Grafisch Ontwerp & Typografie',
            artDesignText: 'Joodse ontwerpers — Herb Lubalin, El Lissitzky, Peter Behrens — definieerden modernistische typografie en lay-out. Het Bauhaus kende een diepgaande Joodse betrokkenheid. Hebreeuwse letters werden een kunstvorm. Israëlisch grafisch ontwerp is internationaal invloedrijk.',
            artSupermanTitle: 'Comics & Graphic Novels',
            artSupermanText: 'Superman, bedacht door Jerry Siegel en Joe Shuster, belichaamt de immigrantenervaring: een buitenstaander die de wereld redt onder een geheime identiteit. Joodse kunstenaars stonden ook aan de wieg van de moderne graphic novel, van Will Eisners baanbrekende <em>A Contract with God</em> to Art Spiegelmans met een Pulitzerprijs bekroonde <em>Maus</em>',
            artArchitectureTitle: 'Architectuur',
            artArchitectureText: 'Van Daniel Libeskind (Joods Museum Berlijn) tot Frank Gehry: Joodse architecten hebben iconische ruimtes gevormd. Libeskinds grillige, op trauma gebaseerde vormen gaven tastbare gestalte aan herinnering en afwezigheid.',
            artSculptureTitle: 'Anish Kapoor',
            artSculptureText: 'In Mumbai geboren, in Londen gevestigde beeldhouwer. <em>Cloud Gate</em> (Chicago), de Orbit-toren (Londen). Meester van reflecterende oppervlakken, leegte en monumentale schaal. Joods erfgoed ontmoet hindoe-boeddhistische esthetiek.',
            musicSubTitle: 'Van tempelpsalmen tot moderne pop',
            musicIntro: 'Joodse muzikale tradities variëren van de oude tempelliturgie tot klezmer, operazang, jazz-innovatie en hedendaagse popmuziek. De immigrantenervaring heeft de Amerikaanse muziek op diepgaande wijze gevormd.',
            musicLiturgyTitle: 'Liturgische Muziek',
            musicLiturgyText: 'De cantor (chazan) is een solist die het gebed leidt. Het zingen van Thoragedeelten, Kol Nidre op Jom Kippoer, synagogekoren — Joodse sacrale muziek heeft een kenmerkend geluid gevormd door modale toonladders (nigunim) met Oost-Europese, Sefardische en Mizrahi-varianten.',
            musicHasidicTitle: 'Chassidische Nigunim',
            musicHasidicText: 'Woordloze melodieën (nigunim) bedoeld voor spirituele verheffing. De Ba\'al Sjem Tov leerde dat muziek de ziel direct kan bereiken. Carlebach-melodieën zijn denominatiegrenzen overschreden en zijn universeel Joods geworden.',
            musicKlezmerTitle: 'Klezmer',
            musicKlezmerText: 'Oost-Europese Joodse volksmuziek. Gedreven door klarinet, emotioneel veelzijdig — van bruiloftsdansen tot klaagliederen. Bijna uitgestorven na de Holocaust, maar herleefd in de jaren 70 door Amerikaanse musici. Nu een wereldgenre vermengd met jazz, rock en wereldmuziek.',
            musicJazzClassicalTitle: 'Jazz & Klassiek',
            musicJazzClassicalText: 'George Gershwin overbrugde klassiek en populair. Leonard Bernstein was Amerika\'s grootste dirigent en componist (<em>West Side Story</em>). Benny Goodman, Artie Shaw — Joden definieerden swing. Aaron Copland creëerde "het Amerikaanse geluid."',
            musicPopRockTitle: 'Pop & Rock',
            musicPopRockText: 'Bob Dylan (geboren Zimmerman). Paul Simon. Billy Joel. Carole King. Lou Reed. The Ramones. Het muzikale DNA van 20e-eeuws Amerika. Vaak werkende klasse New Yorkse Joodse achtergronden omgezet in universele kunst. In de hiphop hielpen drie Joodse jongens uit New York — Mike D, Ad-Rock, MCA (The Beastie Boys) — het genre uit te vinden, wat bewijst dat hiphop altijd een Joodse draad in zich heeft gehad.',
            musicIsraeliTitle: 'Israëlische Muziek',
            musicIsraeliText: 'Van pionierende zionistische liederen (<em>Hatikvah</em>) tot hedendaagse popsterren (Idan Raichel, Dudu Tasa, Noa Kirel). Israëlische muziek smelt Mediterrane, Mizrahi en mondiale invloeden samen. Eurovisie-overwinningen. Een bloeiende, genre-doorbrekende scene.',
            musicMatisyahuTitle: 'Matisyahu & Hedendaags',
            musicMatisyahuText: 'Chassidische reggae-artiest die Joodse thema\'s bij een wereldwijd publiek bracht. De grens tussen sacraal en seculier in Joodse muziek blijft vervagen — religieuze rappers, orthodoxe dj\'s en klezmer-metalbands.',
            cinemaSub: 'Cinema',
            cinemaLabel: 'Beeld & Verhaal',
            cinemaIntro: 'Joden bouwden Hollywood. Van de stille film tot vandaag hebben Joodse producenten, regisseurs, schrijvers en acteurs de mondiale cinema gevormd. Het immigrantsverlangen om verhalen te vertellen, zichzelf opnieuw uit te vinden en te navigeren tussen werelden dreef een hele kunstvorm aan.',
            cinemaMarxTitle: 'The Marx Brothers',
            cinemaMarxText: 'Groucho, Chico, Harpo (geb. Manfred, Leonard, Julius Marx). Revolutionaire komedianten die autoriteit, logica en waardigheid ontmantelden met surreële snelheid. <em>Duck Soup</em>, <em>A Night at the Opera</em>. Joodse humor als totale culturele subversie.',
            cinemaWoodyTitle: 'Woody Allen',
            cinemaWoodyText: 'Schrijver-regisseur-acteur (geb. Allen Konigsberg). Neurotische, intellectuele humor. <em>Annie Hall</em>, <em>Manhattan</em>, <em>Stardust Memories</em>. Bracht Joodse zelfanalyse en angst in het kunstcinemasegment. Persoonlijk diep controversieel, onmiskenbaar invloedrijk.',
            cinemaSpielbergTitle: 'Steven Spielberg',
            cinemaSpielbergText: 'Meesterverteller — avontuur (<em>Indiana Jones</em>), oorlog (<em>Saving Private Ryan</em>) en Holocaust (<em>Schindler\'s List</em>). Spielbergs Joodse identiteit loopt als een rode draad door zijn werk, culminerend in <em>Schindler\'s List</em>, dat hij zei "aan de geschiedenis verschuldigd" te zijn.',
            cinemaKubrickTitle: 'Stanley Kubrick',
            cinemaKubrickText: 'Perfectionistisch meester van de vorm. <em>A Clockwork Orange</em>, <em>2001: A Space Odyssey</em>, <em>The Shining</em>. Joodse Bronx-afkomst gefilterd in een koude, cerebrale cinematografische visie. De regisseurs\' regisseur.',
            cinemaActorsTitle: 'Titanen van het Witte Doek',
            cinemaActorsText: 'Kirk Douglas, Tony Curtis, Lauren Bacall, Dustin Hoffman, Barbra Streisand, Jerry Seinfeld, Sarah Silverman, Natalie Portman — Joodse acteurs hebben de Amerikaanse filmspelkunst door een eeuw heen gedefinieerd, omgaand met identiteit, stereotypen en roem.',
            cinemaStoryTitle: 'Joods Verhalen op het Witte Doek',
            cinemaStoryText: 'Joodse filmmakers hebben essentiële films gemaakt over identiteit, diaspora, herinnering en humor. <em>Fiddler on the Roof</em>, <em>Yentl</em>, <em>The Producers</em>, <em>Shoah</em>, <em>La vita è bella</em>. Het witte doek werd een plek om te getuigen van overleving.',
            scienceTagline: 'Kennis & Ontdekking',
            scienceBioTitle: 'Biologie & Geneeskunde',
            scienceBioText: 'Jonas Salk (poliovaccin), Aaron Klug (kristallografie), Elisabeth Blackburn (telomeeronderzoek). Joodse wetenschappers vormden de moderne geneeskunde en biologie in een verhouding ver boven hun aandeel in de bevolking. Salk weigerde het poliovaccin te patenteren.',
            scienceMedicineTitle: 'Psychiatrie & Psychologie',
            scienceMedicineText: 'Sigmund Freud vond de psychoanalyse uit. Viktor Frankl ontwikkelde de logotherapie in een concentratiekamp. Abraham Maslow bouwde de behoeftehiërarchie. Joodse denkers creëerden de taal waarmee de moderne wereld het zelf begrijpt.',
            scienceMathTitle: 'Wiskunde & Fysica',
            scienceMathText: 'Albert Einstein, Richard Feynman, Niels Bohr (half-Joods), David Hilbert, Emmy Noether, John von Neumann. De Joodse bijdrage aan de 20e-eeuwse fysica en wiskunde herschreef ons begrip van de werkelijkheid zelf.',
            scienceTechTitle: 'Technologie & Computers',
            scienceTechText: 'Google (Brin/Page), Intel (Andy Grove), Dell (Michael Dell), Oracle (Larry Ellison). De Joodse bijdrage aan Silicon Valley is diepgaand. Israëls "Start-Up Nation" heeft meer op NASDAQ genoteerde bedrijven dan enig ander land behalve de VS en China.',
            antisemitismTagline: 'Donkere stromingen',
            antiTerrorTitle: 'Het Tijdperk van de Terreur',
            antiTerrorIntro: 'Vanaf 2001 tot heden muteerde antisemitisme opnieuw — en vond nieuwe uitdrukking via jihadistische ideologie, online radicalisering en een nieuwe versmelting van rechts- en linksextremistische narratieven.',
            antiConspiracyTitle: 'Complot & Vervangingstheorie',
            antiConspiracyText: 'De "Great Replacement"-complottheorie — dat Joden niet-blanke immigratie orkestreren om de blanke cultuur te vernietigen — dreef aanslagen in Pittsburgh (2018), Halle (2019) en Jersey City (2019). Dit zijn geen geïsoleerde eenzame wolven; zij delen een tekst.',
            antiRacialTitle: 'Raciaal Antisemitisme',
            antiRacialText: 'De 19e en 20e eeuw zagen de transformatie van religieuze anti-judaïsme naar raciale pseudowetenschap. Joden werden geclassificeerd als een apart, inferieur ras. Deze ideologie bereikte haar logisch einde in de Holocaust — de systematische moord op 6 miljoen Joden.',
            antiReligiousTitle: 'Religieus Antisemitisme',
            antiReligiousText: 'Eeuwenlang beschuldigde het christelijk Europa Joden van Godsmoord (het doden van Christus), bronnenvergiftiging en rituele moord (bloedlaster). Deze leugens dreven pogroms, verdrijvingen en massamoorden aan. Middeleeuws antisemitisme vormde het sjabloon voor latere rassentheorieën.',
            antiIslamicTitle: 'Islamitisch Antisemitisme',
            antiIslamicText: 'Hoewel veel moslims en Joden historisch gezien vreedzaam samenleefden, heeft de moderne politieke islam antisemitische complottheorieën geïncorporeerd, met name via Hamas, Hezbollah en Iraanse staatspropaganda. Dit onderscheidt zich van de islamitische traditie zelf.',
            antiProgressiveTitle: 'Progressief Antisemitisme',
            antiProgressiveText: 'Een nieuwe vorm ontstond in de 21e eeuw: het framen van Joden als inherent "bevoorrechte" onderdrukkers in intersectionele kaders, het toepassen van maatstaven op het zionisme die op geen enkele andere nationale beweging worden toegepast, en het afdoen van Joodse zorgen als manipulatie.',
            antiLeftIslamTitle: 'De Links-Islam Alliantie',
            antiLeftIslamText: 'Na 7 oktober ontstond een politieke alliantie tussen westerse progressieve bewegingen en islamistische groepen, verenigd door anti-Israël sentiment. Veel Joodse progressieven voelden zich in de steek gelaten door bondgenoten die geen moeite hadden met antisemitische leuzen en geweld tijdens demonstraties.',
            mapTagline: 'Wereldwijde diaspora',
            timelineTagline: 'Van de oudheid tot de moderne tijd',
            timelineIntro: 'De Joodse geschiedenis strekt zich uit van de aartsvaders van het oude Kanaän tot de wedergeboorte van een staat in 1948 en daarna. Deze tijdlijn beslaat de grote tijdperken — bijbels, klassiek, middeleeuws, modern — en de gebeurtenissen die zowel Joden als de wereld hebben gevormd.',
            aboutTagline: 'Een uitgebreide verkenning',
            aboutIntro: 'Deze website dient als een uitgebreide bron voor de verkenning van de Joodse beschaving — van haar oude oorsprong tot de levendige gemeenschappen van vandaag.',
            aboutMissionTitle: 'Onze Missie',
            aboutMissionText: 'Een toegankelijk, uitgebreid overzicht bieden van de Joodse beschaving — van bijbelse oorsprong tot het hedendaagse leven — dat educatief, evenwichtig en respectvol is.',
            aboutPerspectiveTitle: 'Mondiaal Perspectief',
            aboutPerspectiveText: 'Joodse gemeenschappen bestaan al millennia lang op elk continent. Deze site heeft als doel de volledige diversiteit van de Joodse ervaring te vertegenwoordigen — Asjkenazisch, Sefardisch, Mizrahi, Ethiopisch, Indiaas en meer.',
            aboutCultureTitle: 'Cultuur & Continuïteit',
            aboutCultureText: 'De Joodse cultuur heeft ballingschap, vervolging en verspreiding overleefd via literatuur, recht, taal en geheugen. Deze site documenteert die buitengewone keten van continuïteit.',
            aboutIssuesTitle: 'Hedendaagse Vraagstukken',
            aboutIssuesText: 'De site behandelt antisemitisme, Israël en de complexe politiek van Joodse identiteit in de moderne wereld — met nuance, eerlijkheid en een toewijding aan waarheid boven gemak.'
        }
    };

    // --- CORE FUNCTIONS ---
    window.setLanguage = function (lang) {
        window.currentLang = lang;
        document.documentElement.lang = lang;
        document.body.classList.toggle('nl', lang === 'nl');
        localStorage.setItem('tonic_lang', lang);

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        const t = window.translations[lang];
        if (t) {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (t[key]) {
                    if (t[key].includes('<')) el.innerHTML = t[key];
                    else el.textContent = t[key];
                }
            });
        }

        // --- Handle data-lang spans (for pages like israel.html) ---
        document.querySelectorAll('[data-lang]:not(.lang-btn)').forEach(el => {
            el.style.display = (el.dataset.lang === lang) ? '' : 'none';
        });

        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    };

    function setForcedNavState(subId) {
        forcedNavState = {
            subId,
            expiresAt: Date.now() + 3000
        };
    }


    window.updateNavStates = function (forcedSubId) {
        // Find all elements that can be navigation targets
        const sections = document.querySelectorAll('section[id], .container[id], .subsection[id], div[id], details[id]');

        let currentSubId = "";
        let currentSectionId = "";

        // Navigation Hierarchy Mapping
        const parentMap = {
            'intro': 'people',
            'whoisajew': 'people', 'apeople': 'people', 'cohen': 'people', 'contemporary': 'people',
            'religion-texts': 'religion', 'religion-rituals': 'religion', 'religion-movements': 'religion',
            'literature': 'culture', 'art': 'culture', 'architecture': 'culture', 'music': 'culture', 'cinema': 'culture',
            'facts': 'israel', 'indigenous': 'israel', 'demographics': 'israel', 'myths': 'israel', 'israel-region': 'israel',
            'israel-democracy': 'israel', 'israel-antisemitism': 'israel', 'israel-voices': 'israel', 'israel-criticism': 'israel',
            'history-timeline': 'history-timeline', 'diaspora-map': 'diaspora-map', 'about': 'about'
        };
        const mainNavIds = ['people', 'religion', 'culture', 'science', 'antisemitism', 'history-timeline', 'diaspora-map', 'israel', 'about'];

        const scrollPos = window.scrollY + 110; // Clearance for header height (60px-100px)

        // 1. Determine which sub-section is currently in view
        if (forcedSubId) {
            currentSubId = forcedSubId;
        } else if (forcedNavState && forcedNavState.expiresAt > Date.now()) {
            currentSubId = forcedNavState.subId;
        } else if (window.scrollY < 100) {
            currentSubId = "top";
            currentSectionId = "";
        } else {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const offsetTop = rect.top + window.scrollY;
                if (scrollPos >= offsetTop) {
                    currentSubId = section.id;
                }
            });
        }

        // 2. Map sub-section to its parent main section
        if (currentSubId) {
            if (mainNavIds.includes(currentSubId)) {
                currentSectionId = currentSubId;
            } else if (parentMap[currentSubId]) {
                currentSectionId = parentMap[currentSubId];
            }
        }

        // 3. Keep track of current main section
        if (currentSectionId !== window.lastSectionId) {
            window.lastSectionId = currentSectionId;
        }

        // 4. Update Link Classes (Main Nav & Mobile Nav)
        const allNavLinks = document.querySelectorAll('#main-nav a, .mobile-nav a');
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            let isActive = false;

            const hashIndex = href.indexOf('#');
            const anchor = hashIndex !== -1 ? href.substring(hashIndex + 1) : '';

            if (anchor) {
                const normalizedAnchor = anchor === 'intro' ? 'people' : anchor;
                isActive = (normalizedAnchor === currentSectionId || normalizedAnchor === currentSubId);
            } else if (href === '#top' || href === '#') {
                isActive = (currentSubId === 'top');
            }

            link.classList.toggle('active', isActive);
        });
    }

    window.initScrollReveal = function () {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    window.toggleMobileMenu = function () {
        const menuBtn = document.getElementById('menu-btn');
        const mobileOverlay = document.getElementById('mobile-overlay');
        if (menuBtn && mobileOverlay) {
            const isOpen = menuBtn.classList.toggle('active');
            mobileOverlay.classList.toggle('active', isOpen);
            menuBtn.setAttribute('aria-expanded', String(isOpen));
            mobileOverlay.setAttribute('aria-hidden', String(!isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        }
    };

    window.closeMobileMenu = function () {
        const menuBtn = document.getElementById('menu-btn');
        const mobileOverlay = document.getElementById('mobile-overlay');
        if (menuBtn) {
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
            mobileOverlay.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.remove('menu-open');
    };

    document.addEventListener('DOMContentLoaded', () => {
        const savedLang = localStorage.getItem('tonic_lang') || 'en';
        window.setLanguage(savedLang);
        window.initScrollReveal();
        const initialHashId = window.location.hash.replace('#', '');
        if (initialHashId) {
            setForcedNavState(initialHashId);
            window.updateNavStates(initialHashId);
            window.setTimeout(window.updateNavStates, 800);
        } else {
            window.updateNavStates();
        }

    });

    window.addEventListener('scroll', () => window.updateNavStates());
    window.addEventListener('load', () => window.updateNavStates());
    window.addEventListener('hashchange', () => {
        const hashId = window.location.hash.replace('#', '');
        if (hashId) {
            setForcedNavState(hashId);
            window.updateNavStates(hashId);
        }
        window.updateNavStates(hashId);
    });

    document.addEventListener('click', event => {
        const link = event.target.closest('#main-nav a, .mobile-nav a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || !href.includes('#')) return;

        const hashId = href.split('#')[1];
        if (hashId) {
            // Immediate UI feedback
            document.querySelectorAll('#main-nav a, .mobile-nav a').forEach(el => el.classList.remove('active'));
            link.classList.add('active');

            setForcedNavState(hashId);
            window.updateNavStates(hashId);
            // Small delay to let the browser handle the click/navigation
            window.requestAnimationFrame(() => {
                window.updateNavStates(hashId);
            });
        }
    });

    // --- MODAL LOGIC FOR ISRAEL DEMOGRAPHICS ---
    const groupData = {
        yemenite: {
            en: { title: 'Yemenite Jews', subtitle: 'Ancient & Isolated', text: 'Arrived in the 19th-20th century. Known for unique traditions and silverwork. Operation Magic Carpet (1949) brought nearly the entire community to Israel.' },
            nl: { title: 'Jemenitische Joden', subtitle: 'Eeuwenoud & Geïsoleerd', text: 'Arriveerden in de 19e-20e eeuw. Bekend om unieke tradities en zilverwerk. Operatie Magic Carpet (1949) bracht bijna de gehele gemeenschap naar Israël.' }
        },
        iraqi: {
            en: { title: 'Iraqi Jews', subtitle: 'Babylonian Heritage', text: 'Descendants of the oldest Jewish community in the world. Emigrated after 1948 following persecution and state-sponsored violence.' },
            nl: { title: 'Iraakse Joden', subtitle: 'Babylonisch Erfgoed', text: 'Afstammelingen van de oudste Joodse gemeenschap ter wereld. Geëmigreerd na 1948 na vervolging en door de staat gesteund geweld.' }
        },
        moroccan: {
            en: { title: 'Moroccan Jews', subtitle: 'Sephardic Legacy', text: 'The largest group of Mizrahi Jews in Israel. Brought a rich culture of liturgy, food, and music. Over 250,000 lived in Morocco before 1948.' },
            nl: { title: 'Marokkaanse Joden', subtitle: 'Sefardische Erfenis', text: 'De grootste groep Mizrahi-Joden in Israël. Brachten een rijke cultuur van liturgie, eten en muziek mee. Voor 1948 woonden er meer dan 250.000 in Marokko.' }
        },
        ethiopian: {
            en: { title: 'Ethiopian Jews', subtitle: 'Beta Israel', text: 'Practiced an ancient form of Judaism in isolation for 2,000 years. Airlifted in dramatic operations during the 1980s and 90s.' },
            nl: { title: 'Ethiopische Joden', subtitle: 'Beta Israel', text: 'Beoefenden 2.000 jaar lang in isolatie een oude vorm van jodendom. Overgevlogen in spectaculaire operaties in de jaren 80 en 90.' }
        },
        iranian: {
            en: { title: 'Iranian Jews', subtitle: 'Persian Roots', text: 'One of the oldest diaspora communities. Many fled after the 1979 Islamic Revolution. Deeply integrated into Israeli professional and cultural life.' },
            nl: { title: 'Iraanse Joden', subtitle: 'Perzische Wortels', text: 'Een van de oudste diaspora-gemeenschappen. Velen vluchtten na de Islamitische Revolutie van 1979. Diep geïntegreerd in het Israëlische professionele en culturele leven.' }
        },
        druze: {
            en: { title: 'Druze', subtitle: 'Loyal Citizens', text: 'An Arabic-speaking esoteric religious group. Druze men serve in the IDF and are deeply integrated into Israeli society, holding high positions in politics and military.' },
            nl: { title: 'Druzen', subtitle: 'Loyale Burgers', text: 'Een Arabischtalige esoterische religieuze groep. Druzische mannen dienen in de IDF en zijn diep geïntegreerd in de Israëlische samenleving.' }
        },
        bedouin: {
            en: { title: 'Bedouin', subtitle: 'Desert Nomads', text: 'Traditionally nomadic Arab tribes. Many serve as elite trackers in the IDF. Challenges remain regarding land and urbanization, but they are a key part of the Israeli mosaic.' },
            nl: { title: 'Bedoeïnen', subtitle: 'Woestijnnomaden', text: 'Traditioneel nomadische Arabische stammen. Velen dienen als elite-trackers in de IDF. Belangrijk onderdeel van de Israëlische samenleving.' }
        },
        christian: {
            en: { title: 'Arab Christians', subtitle: 'Vibrant Minority', text: 'High educational achievement and socioeconomic status. Proudly Israeli while maintaining their distinct cultural and religious heritage.' },
            nl: { title: 'Arabische Christenen', subtitle: 'Levendige Minderheid', text: 'Hoge onderwijsgraad en sociaaleconomische status. Trots Israëlisch met behoud van eigen cultureel en religieus erfgoed.' }
        },
        russian: {
            en: { title: 'Russian Jews', subtitle: 'The Great Wave', text: 'Over one million people emigrated from the former Soviet Union in the 1990s. They transformed Israeli high-tech, arts, and politics, making Israel the world\'s largest Russian-speaking community outside the FSU.' },
            nl: { title: 'Russische Joden', subtitle: 'De Grote Golf', text: 'Meer dan een miljoen mensen emigreerden in de jaren 90 uit de voormalige Sovjet-Unie. Ze transformeerden de Israëlische high-tech, kunst en politiek.' }
        },
        indian: {
            en: { title: 'Indian Jews', subtitle: 'Bene Israel & Cochin', text: 'A community that lived in India for over 2,000 years without ever experiencing antisemitism. Most moved to Israel in the 1950s and 60s, bringing a unique blend of Jewish and Indian traditions.' },
            nl: { title: 'Indiase Joden', subtitle: 'Bene Israel & Cochin', text: 'Een gemeenschap die meer dan 2.000 jaar in India woonde zonder ooit antisemitisme te ervaren. De meesten verhuisden in de jaren 50 en 60 naar Israël.' }
        }
    };

    window.showGroupModal = function (groupId) {
        const data = groupData[groupId];
        if (!data) return;

        const modalOverlay = document.getElementById('group-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const modalText = document.getElementById('modal-text');
        const modalImageContainer = document.getElementById('modal-image-container');

        if (!modalOverlay || !modalTitle || !modalSubtitle || !modalText) return;

        const langData = data[window.currentLang] || data['en'];

        modalTitle.textContent = langData.title;
        modalSubtitle.textContent = langData.subtitle;
        modalText.innerHTML = langData.text;

        if (modalImageContainer) modalImageContainer.style.display = 'none';
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeGroupModal = function () {
        const modalOverlay = document.getElementById('group-modal');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        // Attach click listener to close group modal when clicking outside
        const groupModal = document.getElementById('group-modal');
        if (groupModal) {
            groupModal.addEventListener('click', (e) => {
                if (e.target === groupModal) window.closeGroupModal();
            });
        }
    });

    // Smooth scroll for back-to-top links
    document.addEventListener('click', event => {
        const link = event.target.closest('.back-to-top a, a[href="#top"]');
        if (!link) return;
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Clear hash quietly
        if (window.history.pushState) {
            window.history.pushState(null, null, window.location.pathname + window.location.search);
        }
        setForcedNavState('top');
        window.updateNavStates('top');
    });

})();
