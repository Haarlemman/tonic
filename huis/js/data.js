const houseConfig = {
    audio: {
        tension: "../assets/audio/Tension_Short_07.mp3",
        intro: "../assets/audio/premonition.mp3",
        victory: "../assets/audio/victory.wav",
        squeak: "../assets/audio/squeak.mp3"
    }
};

window.houseConfig = houseConfig;

window.roomContent = {
    hall: {
        title: "Reception Hall",
        title_nl: "Ontvangsthal",
        description: "The place where everything begins. A threshold between the world outside and the world within. Every room in the house holds a reflection — click the glowing icon to leave your mark.",
        description_nl: "De plek waar alles begint. Een drempel tussen de buitenwereld en de wereld binnenin. Elke kamer in het huis bevat een reflectie — klik op het gloeiende icoon om je sporen na te laten.",
        hex: 0x2c3e50,
        playlist: [
            {
                artist: "Paradox Prime",
                track: "The House of Awe",
                src: "../assets/audio/TheHouseofAwe.mp3",
                lyrics: [
                    { time: 1.00, text: "\u2014", text_nl: "\u2014" },
                    { time: 10.52, text: "The Rolls Royce sits", text_nl: "De Rolls Royce staat stil" },
                    { time: 14.40, text: "The Fiat engine whines", text_nl: "De Fiat-motor jankt" },
                    { time: 21.09, text: "Big dreams", text_nl: "Grote dromen" },
                    { time: 23.58, text: "Small battery", text_nl: "Kleine accu" },
                    { time: 26.14, text: "", text_nl: "" },
                    { time: 26.57, text: "The screen drinks", text_nl: "Het scherm drinkt" },
                    { time: 28.81, text: "The man thins", text_nl: "De man wordt mager" },
                    { time: 30.65, text: "", text_nl: "" },
                    { time: 31.15, text: "Used to be \"Awe\"", text_nl: "Vroeger was het verbazing" },
                    { time: 36.07, text: "Now it\u2019s a sigh...", text_nl: "Nu is het een zucht..." },
                    { time: 40.95, text: "", text_nl: "" },
                    { time: 41.42, text: "Welcome to the House...", text_nl: "Welkom in het Huis..." },
                    { time: 46.30, text: "...the House of \"Aaaah\"", text_nl: "...het Huis van 'Aaaah'" },
                    { time: 53.26, text: "", text_nl: "" },
                    { time: 63.73, text: "A father in the room", text_nl: "Een vader in de kamer" },
                    { time: 66.40, text: "A ghost on the map", text_nl: "Een geest op de kaart" },
                    { time: 68.97, text: "Eyes on the glass", text_nl: "Ogen op het glas" },
                    { time: 71.35, text: "Dopamine on tap", text_nl: "Dopamine uit de kraan" },
                    { time: 75.00, text: "", text_nl: "" },
                    { time: 88.30, text: "Infinite tools", text_nl: "Oneindig veel gereedschap" },
                    { time: 90.69, text: "Finite man", text_nl: "De eindige mens" },
                    { time: 92.78, text: "", text_nl: "" },
                    { time: 94.33, text: "Landing on feet...", text_nl: "Landen op je voeten..." },
                    { time: 99.67, text: "Life out of reach...", text_nl: "Het leven buiten bereik..." },
                    { time: 103.57, text: "", text_nl: "" },
                    { time: 104.74, text: "Wherever I can...", text_nl: "Waar ik maar kan..." },
                    { time: 109.37, text: "On a digital beach.", text_nl: "Op een digitaal strand." },
                    { time: 114.01, text: "", text_nl: "" },
                    { time: 121.02, text: "Are you still in there?", text_nl: "Ben je er nog?" }
                ]
            }
        ]
    },

    living: {
        title: "Living Room",
        title_nl: "Woonkamer",
        description: "The stage for every story told and untold. Screens glow, the couch holds the weight of a thousand evenings. What has this room witnessed in your life?",
        description_nl: "Het podium voor elk verhaal, verteld en onverteld. Schermen gloeien, de bank draagt het gewicht van duizend avonden. Wat heeft deze kamer meegemaakt in jouw leven?",
        hex: 0xe65100,
        playlist: [
            { artist: "Paradox Prime", track: "Hope", src: "../assets/audio/Hope.mp3" }
        ],
        videoPlaylist: [
            { title: "The Premonition", src: "../assets/video/premonition.mp4" },
            { title: "The History of Mankind", src: "../assets/video/historytrailer.mp4" },
            { title: "LIFE or DREAM?", src: "../assets/video/life-or-dream.mp4" }
        ],
        videoInterfacePos: { x: 3.0, y: 3.2, z: -4.9 },
        tvImages: [
            { image: "../assets/images/tv.jpg", color: "#000", text: "" },
            { image: "../assets/images/brug.jpg", color: "#990000", text: "" },
            { image: "../assets/images/bavo1.jpg", color: "#000099", text: "" },
            { image: "../assets/images/spaarne1.jpg", color: "#009900", text: "" },
            { image: "../assets/images/spaarne2.jpg", color: "#330066", text: "" },
            { image: "../assets/images/sea.jpg", color: "#0000aa", text: "" }
        ]
    },

    studio: {
        title: "Studio",
        title_nl: "Studio",
        description: "This is where the signal is sent. Machines hum, ideas crystallise, sound becomes form. What would you create if nothing stood in your way?",
        description_nl: "Dit is waar het signaal wordt verzonden. Machines gonzen, ideeën kristaliseren, geluid wordt vorm. Wat zou je creëren als niets je in de weg stond?",
        hex: 0x6366f1,
        playlist: [
            { artist: "Paradox Prime", track: "Heartroll", src: "../assets/audio/Heartroll.mp3" }
        ]
    },

    bedroom: {
        title: "Bedroom",
        title_nl: "Slaapkamer",
        description: "The border country between waking and dreaming. Where the mask comes off, the body rests, and the mind wanders into the impossible. What lives here in the dark?",
        description_nl: "Het grensland tussen waken en dromen. Waar het masker afgaat, het lichaam rust en de geest afdwaalt naar het onmogelijke. Wat leeft hier in het donker?",
        hex: 0x004d40,
        playlist: [
            { artist: "Paradox Prime", track: "Dreaming", src: "../assets/audio/sleepy.mp3" },
            { artist: "Paradox Prime", track: "Prepare", src: "../assets/audio/prepare.mp3" },
            { artist: "Paradox Prime", track: "Bells", src: "../assets/audio/bells.mp3" }
        ],
        videoPlaylist: [
            { title: "Night After Night", artist: "Paradox Prime", src: "../assets/video/nain.mp4", volume: 0.4 },
            { title: "The Spirit", artist: "David Enker", src: "../assets/video/spirit.mp4" },
            { title: "Dreaming", artist: "Paradox Prime", src: "../assets/video/dreaming.mp4" }
        ]
    },

    attic: {
        title: "Attic",
        title_nl: "Zolder",
        description: "The highest room. What we keep but never visit. Old frequencies, old feelings, the residue of who we were. The lamp responds to what it hears.",
        description_nl: "De hoogste kamer. Wat we bewaren maar nooit bezoeken. Oude frequenties, oude gevoelens, het residu van wie we waren. De lamp reageert op wat hij hoort.",
        hex: 0x5d4037,
        playlist: [
            { artist: "Paradox Prime", track: "Curiosity", src: "../assets/audio/Curiosity.mp3" }
        ]
    },

    bathroom: {
        title: "Bathroom",
        title_nl: "Badkamer",
        description: "The most honest room. No performance. Steam, mirror, tile. Where the day is washed off and you are briefly just yourself. What ritual holds you together?",
        description_nl: "De meest eerlijke kamer. Geen vertoning. Stoom, spiegel, tegels. Waar de dag wordt afgewassen en je even gewoon jezelf bent. Welk ritueel houdt jou bij elkaar?",
        hex: 0x0696a4,
        playlist: [
            { artist: "Paradox Prime", track: "Glass Garden Waltz", src: "../assets/audio/GlassGardenWaltz.mp3" }
        ],
        videoPlaylist: [
            { title: "Time Is Now", src: "../assets/video/Time-Is-Now.mp4" }
        ],
        videoInterfacePos: { x: 2.8, y: 2.8, z: -4.92 }
    },

    toilet: {
        title: "The Little Room",
        title_nl: "Het kleinste kamertje",
        description: "Everyone ends up here eventually. The smallest room in the house — and somehow the one where the most unexpected thoughts arrive. A room of its own kind of silence.",
        description_nl: "Iedereen komt hier uiteindelijk terecht. De kleinste kamer van het huis — en op de een of andere manier de kamer waar de meest onverwachte gedachten opkomen. Een kamer met zijn eigen soort stilte.",
        hex: 0x046896,
        interiorWidth: 3.0,
        interiorDepth: 5.0,
        playlist: [
            { artist: "Paradox Prime", track: "Mysterious Heartbeat 1", src: "../assets/audio/MysteriousHeartbeat1.mp3" },
            { artist: "Paradox Prime", track: "Mysterious Heartbeat 2", src: "../assets/audio/MysteriousHeartbeat2.mp3" }
        ]
    },

    basement: {
        title: "Basement",
        title_nl: "Kelder",
        description: "Below the surface, where signals meet shadows. Truth nodes float in the dark. What do you keep down here that you haven't looked at in a while?",
        description_nl: "Onder het oppervlak, waar signalen en schaduwen elkaar ontmoeten. Waarheidsknooppunten zweven in het duister. Wat bewaar je hier beneden waar je al een tijdje niet naar hebt gekeken?",
        hex: 0x334155,
        playlist: [
            { artist: "Paradox Prime", track: "Seven is calling", src: "../assets/audio/Seven.mp3" }
        ]
    },

    annex: {
        title: "The Annex",
        title_nl: "De Aanbouw",
        description: "Added later. An extension of self. The room that wasn't planned but became necessary — the place where new chapters begin to be written.",
        description_nl: "Later toegevoegd. Een verlengstuk van jezelf. De kamer die niet gepland was maar noodzakelijk werd — de plek waar nieuwe hoofdstukken worden geschreven.",
        hex: 0x1a1a1a,
        interiorWidth: 4,
        interiorDepth: 4,
        playlist: [
            { artist: "Paradox Prime", track: "Free Will", src: "../assets/audio/Free_Will.mp3" },
            { artist: "Paradox Prime", track: "Life's Lament", src: "../assets/audio/Lifes_Lament.mp3" }
        ]
    },

    space: {
        title: "The Void",
        title_nl: "Het Universum",
        description: "Beyond the known floor plan. Out here, the rules dissolve. The rocket passes. Stars drift. You've made it to the edge of the House of Awe — what do you carry back?",
        description_nl: "Voorbij de bekende plattegrond. Hier lossen de regels op. De raket passeert. Sterren drijven voorbij. Je hebt de rand van het Huis der Verwondering bereikt — wat neem je mee terug?",
        hex: 0x000000,
        playlist: [
            { artist: "Paradox Prime", track: "No More Pain", src: "../assets/audio/Nomorepain.mp3" }
        ]
    }
};
