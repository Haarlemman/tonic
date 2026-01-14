// Playlists for each room (3 tracks each)
// Video playlists for living room and bedroom (3 clips each)
// V6 - Root Relative Paths Verified
const roomContent = {
    hall: {
        title: "Welcome Hall",
        hex: 0x2c3e50,
        description: "Welcome to The House of Awe. <br><br>Life is complicated, full of surprises, twists and turns, but -within a framework - there is still control. The more you learn, the more you realise you know nothing. This space is a collection of art, music, literature, philosophy, and personal history.",
        playlist: [
            { artist: "Hofesh Shechter", track: "Sun", src: "/assets/audio/Sun.mp3" },
            { artist: "Hugo Kant", track: "Entering the Black Hole", src: "/assets/audio/HugoKant-EnteringtheBlackHole.mp3" },
            { artist: "Jun Miyake", track: "Lmt Act 3 Prologue", src: "/assets/audio/JunMiyake-LmtAct3Prologue.mp3" }
        ]
    },
    living: {
        title: "Living Room",
        hex: 0xe65100,
        description: "Click the TV to switch between Photos and Video Clips.",
        playlist: [
            { artist: "Hazel English", track: "Nine Stories", src: "/assets/audio/HazelEnglish-NineStories.mp3" },
            { artist: "Kalkbrenner/Stromae", track: "Que ce soit clair", src: "/assets/audio/KalkbrennerStromae.mp3" },
            { artist: "Fazerdaze", track: "Bigger", src: "/assets/audio/Fazerdaze-Bigger.mp3" }
        ],
        videoPlaylist: [
            { title: "Graphic Art Reel", src: "/assets/video/art_reel.mp4" },
            { title: "Historical Archive", src: "/assets/video/history.mp4" },
            { title: "Modern Dance Clip", src: "/assets/video/dance.mp4" }
        ],
        tvImages: [
            { text: "PICTURE THIS", color: "#a533fc" },
            { text: "Bavo", image: "/assets/images/bavo1.jpg", color: "#000" },
            { text: "Hitchin, UK", image: "/assets/images/hitchin1.jpg", color: "#999" },
            { text: "Haarlem, Netherlands", color: "#f93a00" },
            { text: "Tonic for the Bones", color: "#93c5fd" },
        ]
    },
    studio: {
        title: "Studio",
        hex: 0x6366f1,
        description: "Dissecting the 'why' of human behavior.",
        playlist: [
            { artist: "Amon Tobin", track: "Feed", src: "/assets/audio/Amon Tobin - Feed.mp3" },
            { artist: "Floating Points", track: "Nespole", src: "/assets/audio/FloatingPoints-Nespole.mp3" },
            { artist: "Kraftwerk", track: "Spacelab", src: "/assets/audio/KraftwerkSpacelab.mp3", volume: 1 }
        ]
    },
    bedroom: {
        title: "Bedroom",
        hex: 0x004d40,
        description: "Where dreaming happens. Use the phone to watch video clips.",
        playlist: [
            { artist: "Nick Drake", track: "From The Morning", src: "/assets/audio/Nick Drake - From The Morning.mp3" },
            { artist: "David Bowie", track: "A New Career in a New Town", src: "/assets/audio/DavidBowie-ANewCareerinaNewTown.mp3" },
            { artist: "Miles Davis", track: "Ascenseur pour l'échafaud", src: "/assets/audio/miles-lift.mp3" }
        ],
        videoPlaylist: [
            { title: "Night After Night", artist: "Paradox Prime", src: "/assets/video/nain.mp4" },
            { title: "The Spirit", artist: "David Enker", src: "/assets/video/spirit.mp4" },
            { title: "Dreaming", artist: "Paradox Prime", src: "/assets/video/dreaming.mp4" },

        ]
    },
    attic: {
        title: "Attic",
        hex: 0x5d4037,
        description: "Dust & Echoes. The repository of the past. Three boxes lie here: History, Family, and the deeply Personal.",
        playlist: [
            { artist: "Billie Holiday", track: "Gloomy Sunday", src: "/assets/audio/GloomySunday-BillieHoliday.mp3" },
            { artist: "Jóhann Jóhannssone", track: "The Theory of Everything", src: "/assets/audio/JóhannJóhannsson.mp3" },
            { artist: "Fyodorov Sisters", track: "Little Star", src: "/assets/audio/FyodorovSisters-LittleStar.mp3" }
        ]
    },
    bathroom: {
        title: "Bathroom",
        hex: 0x0696a4,
        description: "The mirror reflects the physical reality. In the quiet of the morning, thoughts are most audible.",
        playlist: [
            { artist: "Thom Yourke", track: "Dawn Chorus", src: "/assets/audio/RH-DawnChorus.mp3" },
            { artist: "Aphex Twin", track: "Avril 14th", src: "/assets/audio/Aphex-Avril.mp3" },
            { artist: "Brian Eno", track: "An Ending (Ascent)", src: "/assets/audio/Eno-Ending.mp3" }
        ]
    },
    toilet: {
        title: "The Little Room",
        hex: 0x046896,
        interiorWidth: 3.0,
        interiorDepth: 5.0,
        description: "The Think Tank. A quiet place for politics, religion, and rough drafts. Click the notepad to write.",
        playlist: [
            { artist: "Chrysalis", track: "Chrysalis", src: "/assets/audio/chrysalis.mp3" },
            { artist: "Matthew Herbert", track: "Thaumotrope", src: "/assets/audio/Thaumotrope - Matthew Herbert.mp3" },
            { artist: "Philip Glass", track: "Metamorphosis One", src: "/assets/audio/Glass-Meta.mp3" }
        ]
    },
    basement: {
        title: "Basement",
        hex: 0x334155,
        description: "The Engine Room. Dancing nodes react to the baseline. Secrets, fears, and absolute truths live here.",
        playlist: [
            { artist: "I-F", track: "Spiegelbeeld", src: "/assets/audio/I-F - Spiegelbeeld.mp3" },
            { artist: "Model 500", track: "I See The Light", src: "/assets/audio/Model500-ISeeTheLight.mp3" },
            { artist: "Vlinder Vos", track: "Reality", src: "/assets/audio/Reality-VlinderVos.mp3" }
        ]
    }
};
