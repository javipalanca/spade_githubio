#!/usr/bin/env python3
"""
Simple HTTP server for viewing the SPADE landing page
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def main():
    """Start the server and open the browser"""
    # Configuration
    PORT = 8000
    DIRECTORY = Path(__file__).parent
    
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(DIRECTORY), **kwargs)
        
        def log_message(self, format, *args):
            # Reduce server log output
            if args[0].startswith("GET /landing-assets/"):
                return
            super().log_message(format, *args)
    
    # Check if landing page exists
    landing_page = DIRECTORY / "landing-page.html"
    if not landing_page.exists():
        print(f"Error: {landing_page} not found!")
        return
    
    # Check if landing-assets directory exists
    landing_assets = DIRECTORY / "landing-assets"
    if not landing_assets.exists():
        print(f"Warning: {landing_assets} directory not found. Creating it.")
        try:
            os.makedirs(landing_assets)
        except Exception as e:
            print(f"Error creating directory: {e}")

    # Copy images if they exist and landing-assets is empty
    docs_images = DIRECTORY / "docs" / "images"
    if docs_images.exists() and (not landing_assets.exists() or not any(landing_assets.iterdir())):
        print("Copying images from docs/images to landing-assets...")
        try:
            import shutil
            for image_file in docs_images.glob("*"):
                if image_file.is_file():
                    shutil.copy(image_file, landing_assets)
            print("Images copied successfully.")
        except Exception as e:
            print(f"Error copying images: {e}")
    
    # Start server
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}/landing-page.html"
            print(f"Serving SPADE landing page at {url}")
            print("Press Ctrl+C to stop the server")
            
            # Open browser
            try:
                # Try to use the BROWSER environment variable first
                browser_cmd = os.environ.get("BROWSER")
                if browser_cmd:
                    os.system(f'"{browser_cmd}" {url}')
                else:
                    # Fall back to webbrowser module
                    webbrowser.open(url)
            except Exception as e:
                print(f"Warning: Could not open browser: {e}")
                print(f"Please open {url} manually in your browser.")
            
            # Keep the server running
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"Error: Port {PORT} is already in use. Try a different port.")
            # Try with a different port
            alt_port = 8080
            print(f"Trying with port {alt_port}...")
            try:
                with socketserver.TCPServer(("", alt_port), Handler) as httpd:
                    url = f"http://localhost:{alt_port}/landing-page.html"
                    print(f"Serving SPADE landing page at {url}")
                    print("Press Ctrl+C to stop the server")
                    try:
                        webbrowser.open(url)
                    except:
                        pass
                    httpd.serve_forever()
            except Exception as e2:
                print(f"Error with alternative port: {e2}")
        else:
            print(f"Error starting server: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()
