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

def get_commit_frequency():
    # Returns number of commits for a day based on probability
    rand = random.random()
    if rand < 0.1:  # 10% chance of no commits
        return 0
    elif rand < 0.4:  # 30% chance of 1-2 commits
        return random.randint(1, 2)
    elif rand < 0.7:  # 30% chance of 3-5 commits
        return random.randint(3, 5)
    elif rand < 0.9:  # 20% chance of 6-8 commits
        return random.randint(6, 8)
    else:  # 10% chance of 9-12 commits (very active days)
        return random.randint(9, 12)

def get_commit_time(date, commit_number, total_commits):
    # More realistic time distribution based on number of commits
    if total_commits <= 2:
        # For days with few commits, stick to core hours
        hour = random.randint(10, 16)
    else:
        # For busy days, spread throughout the day with higher probability during core hours
        if commit_number < total_commits / 3:
            # Morning commits (higher probability of 9-11)
            hour = random.choices(range(9, 12), weights=[3, 3, 2])[0]
        elif commit_number < 2 * total_commits / 3:
            # Afternoon commits (higher probability of 13-16)
            hour = random.choices(range(12, 17), weights=[1, 2, 3, 3, 2])[0]
        else:
            # Evening commits (higher probability of 16-18)
            hour = random.choices(range(15, 19), weights=[1, 2, 3, 1])[0]
    
    minute = random.randint(0, 59)
    return date.replace(hour=hour, minute=minute)

def generate_commits(year):
    # Start from January 1st of the given year
    current_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    
    # Skip some random days each month (more realistic)
    while current_date <= end_date:
        # Get number of commits for this day
        num_commits = get_commit_frequency()
        
        # Make commits for this day
        for i in range(num_commits):
            commit_date = get_commit_time(current_date, i, num_commits)
            make_commit(commit_date)
        
        # Move to next day
        current_date += timedelta(days=1)

    # Push all commits
    os.system('git push origin main')

if __name__ == "__main__":
    # Generate commits for 2023
    generate_commits(2023) 