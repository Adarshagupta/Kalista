import os
import random
from datetime import datetime, timedelta
import numpy as np

def make_commit(date, activity_type="feature"):
    # Different types of commits for more variety
    commit_types = {
        "feature": ["Add", "Update", "Implement", "Enhance", "Integrate"],
        "bugfix": ["Fix", "Resolve", "Patch", "Debug", "Hotfix"],
        "refactor": ["Refactor", "Optimize", "Clean", "Restructure", "Improve"],
        "docs": ["Document", "Add docs", "Update docs", "Clarify", "Explain"],
        "test": ["Test", "Add tests", "Update tests", "Coverage", "Validate"]
    }
    
    actions = commit_types[activity_type]
    components = ["auth", "api", "ui", "core", "config", "utils", "data", "models", "services", "tests"]
    
    # Generate a more realistic commit message
    action = random.choice(actions)
    component = random.choice(components)
    message = f"{action} {component}: {date.strftime('%Y-%m-%d %H:%M:%S')}"
    
    # Random changes to config.json
    with open('config.json', 'a') as f:
        f.write(f'\n// {message}')
    
    # Git commands with backdated timestamp
    date_str = date.strftime('%Y-%m-%d %H:%M:%S')
    os.system(f'git add .')
    os.system(f'GIT_AUTHOR_DATE="{date_str}" GIT_COMMITTER_DATE="{date_str}" git commit -m "{message}"')

def get_workload_cycle(date):
    # Different factors affecting workload
    day_of_week = date.weekday()  # 0-6 (Mon-Sun)
    week_of_month = date.day // 7 + 1
    month = date.month
    
    # Base workload multiplier
    base_multiplier = 1.0
    
    # Weekend factor (less work on weekends)
    if day_of_week >= 5:  # Weekend
        base_multiplier *= 0.3
    
    # Sprint cycle (assuming 2-week sprints)
    sprint_day = (date.timetuple().tm_yday % 14) + 1
    if sprint_day <= 3:  # Sprint start (planning, setup)
        base_multiplier *= 0.8
    elif sprint_day >= 12:  # Sprint end (crunch time)
        base_multiplier *= 1.5
    
    # Month-end effect (more activity near month end)
    if date.day >= 25:
        base_multiplier *= 1.3
    
    # Quarterly peaks (end of quarters)
    if month in [3, 6, 9, 12] and date.day >= 20:
        base_multiplier *= 1.4
    
    # Year-end effect
    if month == 12 and date.day >= 15:
        base_multiplier *= 0.7  # Holiday season slowdown
    
    return base_multiplier

def get_commit_frequency(date):
    workload = get_workload_cycle(date)
    
    # Base distribution parameters
    base_commits = np.random.negative_binomial(5, 0.5)  # More realistic distribution
    
    # Apply workload multiplier and constraints
    commits = int(base_commits * workload)
    
    # Ensure reasonable bounds
    commits = min(max(commits, 0), 20)  # Cap at 20 commits per day
    
    # Special cases
    if random.random() < 0.05:  # 5% chance of no commits (vacation/sick day)
        return 0
    if random.random() < 0.02:  # 2% chance of high activity day
        return random.randint(15, 20)
    
    return commits

def get_commit_time(date, commit_number, total_commits):
    # Developer behavior patterns
    PATTERNS = {
        'early_bird': {'start': 7, 'peak': 10, 'end': 16},
        'night_owl': {'start': 11, 'peak': 15, 'end': 20},
        'steady_pace': {'start': 9, 'peak': 14, 'end': 18}
    }
    
    # Select pattern based on day
    pattern = random.choice(list(PATTERNS.values()))
    
    if total_commits <= 3:
        # Few commits - cluster around peak hours
        hour = random.randint(pattern['peak']-1, pattern['peak']+1)
    else:
        # Many commits - spread throughout the day
        progress = commit_number / total_commits
        if progress < 0.3:
            # Morning commits
            hour = random.randint(pattern['start'], pattern['peak'])
        elif progress < 0.7:
            # Mid-day commits
            hour = random.randint(pattern['peak']-1, pattern['peak']+1)
        else:
            # Afternoon/evening commits
            hour = random.randint(pattern['peak'], pattern['end'])
    
    # Add some randomness to minutes
    minute = random.randint(0, 59)
    
    # Add some natural clustering
    if random.random() < 0.3:  # 30% chance of commits being close together
        minute = (minute // 15) * 15  # Round to nearest 15 minutes
    
    return date.replace(hour=hour, minute=minute)

def generate_commits(year):
    # Start from January 1st of the given year
    current_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    
    # Activity types and their probabilities
    activity_types = ["feature", "bugfix", "refactor", "docs", "test"]
    activity_weights = [0.4, 0.3, 0.15, 0.1, 0.05]
    
    while current_date <= end_date:
        # Get number of commits for this day
        num_commits = get_commit_frequency(current_date)
        
        # Make commits for this day
        for i in range(num_commits):
            commit_date = get_commit_time(current_date, i, num_commits)
            activity_type = random.choices(activity_types, activity_weights)[0]
            make_commit(commit_date, activity_type)
        
        # Move to next day
        current_date += timedelta(days=1)

    # Push all commits
    os.system('git push origin main')

if __name__ == "__main__":
    # Set random seed for reproducibility
    random.seed(42)
    np.random.seed(42)
    
    # Generate commits for 2023
    generate_commits(2023) 