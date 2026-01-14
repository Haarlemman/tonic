<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Folder Preview</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
        h1 { text-align: center; color: #333; }
        
        /* Grid Layout */
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        /* Card Styling */
        .card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            display: flex;
            flex-direction: column;
            height: 350px; /* Fixed height for uniformity */
        }
        
        .card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }

        /* The Live Preview Window */
        .preview-window {
            height: 250px;
            background: #fff;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid #eee;
        }

        /* Iframe Trickery for Scaling */
        iframe {
            width: 400%;   /* Make it huge... */
            height: 400%;
            border: 0;
            transform: scale(0.25); /* ...then shrink it down */
            transform-origin: 0 0;
            pointer-events: none; /* Disables clicking inside the iframe */
        }

        /* Text Summary */
        .info { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; }
        .info h3 { margin: 0 0 5px 0; font-size: 16px; color: #222; }
        .info a { text-decoration: none; color: inherit; }
        .filename { font-size: 12px; color: #888; margin-top: auto; }
        
        /* Link covering the whole card */
        .card-link { text-decoration: none; color: inherit; }
    </style>
</head>
<body>

    <h1>Project Gallery</h1>
    <div class="gallery">

    <?php
    // 1. Get all HTML files in current directory
    $files = glob("*.html");

    foreach($files as $file) {
        // 2. Parse the Title 
        $content = file_get_contents($file);
        // Simple regex to grab the title tag. 
        // Note: For heavy production, DOMDocument is better, but this is faster for simple files.
        if (preg_match('/<title>(.*?)<\/title>/is', $content, $matches)) {
            $title = $matches[1];
        } else {
            $title = "Untitled Page";
        }

        // 3. Output the HTML Card
        echo '
        <a href="'.$file.'" class="card-link">
            <div class="card">
                <div class="preview-window">
                    <iframe src="'.$file.'" scrolling="no"></iframe>
                </div>
                <div class="info">
                    <h3>'.$title.'</h3>
                    <div class="filename">'.$file.'</div>
                </div>
            </div>
        </a>';
    }
    ?>

    </div>

</body>
</html>