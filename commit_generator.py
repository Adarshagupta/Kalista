import os
import random
from datetime import datetime, timedelta

def make_commit(date):
    # Random changes to config.json
    with open('config.json', 'a') as f:
        f.write('\n// Updated on: ' + date.strftime('%Y-%m-%d'))
    
    # Git commands with backdated timestamp
    date_str = date.strftime('%Y-%m-%d %H:%M:%S')
    os.system(f'git add .')
    os.system(f'GIT_AUTHOR_DATE="{date_str}" GIT_COMMITTER_DATE="{date_str}" git commit -m "Update configuration: {date_str}"')

def generate_commits(year, frequency=3):
    # Start from January 1st of the given year
    current_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    
    while current_date <= end_date:
        # Make random number of commits (1 to frequency) for each day
        for _ in range(random.randint(1, frequency)):
            # Random time between 9 AM and 6 PM
            hour = random.randint(9, 18)
            minute = random.randint(0, 59)
            commit_date = current_date.replace(hour=hour, minute=minute)
            make_commit(commit_date)
        
        # Move to next day
        current_date += timedelta(days=1)

    # Push all commits
    os.system('git push origin main')

if __name__ == "__main__":
    # Generate commits for 2023
    generate_commits(2023, frequency=2) 