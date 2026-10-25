"""Try FoundItemDescriber with a local image.

Usage:
    python test.py path/to/found_item.jpg

If no path is provided, the script looks for ``found_item.jpg`` beside this file.
The Gemini API key is read by FoundItemDescriber from GEMINI_API_KEY or .env.
"""

import argparse
from pathlib import Path

from image_parse import FoundItemDescriber


def main() -> None:
    parser = argparse.ArgumentParser(description="Describe a found item in an image.")
    parser.add_argument(
        "image",
        nargs="?",
        type=Path,
        default=Path(__file__).with_name("found_item.jpg"),
        help="Image file to analyze (default: found_item.jpg beside this script)",
    )
    args = parser.parse_args()

    describer = FoundItemDescriber()
    descriptions = describer.describe_image(args.image)

    print("PRIVATE DETAILED DESCRIPTION (for recovery quiz)")
    print(descriptions["detailed_description"])
    print("\nPUBLIC DESCRIPTION (for listing)")
    print(descriptions["public_description"])


if __name__ == "__main__":
    main()
