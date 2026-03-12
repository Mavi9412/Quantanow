import os

# Define the old and new email addresses
old_email = "hello@quantanow.com"
new_email = "support@quantanow.com"

# Iterate through all files in the current directory
for filename in os.listdir('.'):
    # Only process .html files
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Check if the old email exists in the content
        if old_email in content:
            # Replace all occurrences
            updated_content = content.replace(old_email, new_email)
            
            # Write the updated content back to the file
            with open(filename, 'w', encoding='utf-8') as file:
                file.write(updated_content)
            print(f"Updated email in {filename}")
        else:
            print(f"No match found in {filename}")
