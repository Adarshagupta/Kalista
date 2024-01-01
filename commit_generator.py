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
    day_of_week = date.weekday()
    month = date.month
    year = date.year
    
    # Base multiplier
    base_multiplier = 1.0
    
    # Special handling for Jan and Feb 2024
    if year == 2024 and month <= 2:
        base_multiplier = 1.5  # Higher base activity
        
        # Active days in January and February 2024
        active_days = {
            1: [2, 3, 4, 8, 9, 10, 11, 15, 16, 17, 18, 22, 23, 24, 25, 29, 30, 31],  # January
            2: [1, 5, 6, 7, 12, 13, 14, 19, 20, 21, 26, 27, 28]   # February
        }
        
        if date.day in active_days.get(month, []):
            base_multiplier *= 2.0  # Double activity on specific days
    
    # Weekend adjustment
    if day_of_week >= 5:
        base_multiplier *= 0.5
    
    return base_multiplier

def get_commit_frequency(date):
    workload = get_workload_cycle(date)
    
    if date.year == 2024 and date.month <= 2:
        # For Jan-Feb 2024, ensure minimum commits on active days
        base_commits = random.randint(5, 12)
    else:
        base_commits = np.random.negative_binomial(5, 0.5)
    
    commits = int(base_commits * workload)
    commits = min(max(commits, 0), 20)
    
    return commits

def get_commit_time(date, commit_number, total_commits):
    # Core working hours for Jan-Feb 2024
    if date.year == 2024 and date.month <= 2:
        hour = random.randint(9, 17)  # 9 AM to 5 PM
        minute = random.randint(0, 59)
        return date.replace(hour=hour, minute=minute)
    
    # Regular pattern for other dates
    PATTERNS = {
        'early_bird': {'start': 7, 'peak': 10, 'end': 16},
        'night_owl': {'start': 11, 'peak': 15, 'end': 20},
        'steady_pace': {'start': 9, 'peak': 14, 'end': 18}
    }
    
    pattern = random.choice(list(PATTERNS.values()))
    
    if total_commits <= 3:
        hour = random.randint(pattern['peak']-1, pattern['peak']+1)
    else:
        progress = commit_number / total_commits
        if progress < 0.3:
            hour = random.randint(pattern['start'], pattern['peak'])
        elif progress < 0.7:
            hour = random.randint(pattern['peak']-1, pattern['peak']+1)
        else:
            hour = random.randint(pattern['peak'], pattern['end'])
    
    minute = random.randint(0, 59)
    if random.random() < 0.3:
        minute = (minute // 15) * 15
    
    return date.replace(hour=hour, minute=minute)

def generate_commits(year):
    current_date = datetime(year, 1, 1)
    
    # Only generate for January and February if it's 2024
    if year == 2024:
        end_date = datetime(year, 2, 29)  # February 2024 is a leap year
    else:
        end_date = datetime(year, 12, 31)
    
    activity_types = ["feature", "bugfix", "refactor", "docs", "test"]
    activity_weights = [0.4, 0.3, 0.15, 0.1, 0.05]
    
    while current_date <= end_date:
        num_commits = get_commit_frequency(current_date)
        
        for i in range(num_commits):
            commit_date = get_commit_time(current_date, i, num_commits)
            activity_type = random.choices(activity_types, activity_weights)[0]
            make_commit(commit_date, activity_type)
        
        current_date += timedelta(days=1)

    os.system('git push origin main')

if __name__ == "__main__":
    # Set random seed for reproducibility
    random.seed(42)
    np.random.seed(42)
    
    # Generate commits for 2024
    generate_commits(2024) 