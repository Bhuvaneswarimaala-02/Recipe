import json
import math
import os

# File paths
input_path = r"backend\data\recipes.json"
output_path = r"backend\data\clean_recipes.json"

# Ensure output directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Required fields for MySQL schema
required_fields = [
    "cuisine", "title", "rating", "prep_time", "cook_time",
    "total_time", "description", "nutrients", "serves"
]

def convert_to_null(value):
    if isinstance(value, str) and value.strip().lower() == "nan":
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    return value

def clean_nutrients(nutrients):
    clean = {}
    if not isinstance(nutrients, dict):
        return None
    for key, val in nutrients.items():
        try:
            # Extract numeric part (before space, stripping units like 'g', 'kcal', 'mg')
            number = float(val.split()[0])
            clean[key] = number
        except Exception:
            clean[key] = None
    return clean

def clean_data(record, id_val):
    entry = {"id": id_val}

    for field in required_fields:
        value = record.get(field, None)

        # Handle numeric conversions and NaN replacements
        if field in ["rating", "prep_time", "cook_time", "total_time"]:
            value = convert_to_null(value)
            if value is None:
                entry[field] = None
            else:
                try:
                    entry[field] = float(value) if field == "rating" else int(value)
                except Exception:
                    entry[field] = None
        elif field == "nutrients":
            entry[field] = clean_nutrients(value)
        else:
            entry[field] = value

    return entry

# Read and clean the JSON
with open(input_path, "r", encoding="utf-8") as infile:
    raw_data = json.load(infile)

cleaned_data = []
for i, record in enumerate(raw_data.values(), start=1):
    cleaned_data.append(clean_data(record, i))

# Write the cleaned JSON
with open(output_path, "w", encoding="utf-8") as outfile:
    json.dump(cleaned_data, outfile, indent=2)
