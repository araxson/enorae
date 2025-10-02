#!/usr/bin/env python3

"""
FIGDREAM Project Backup Script (Python Version)
Creates clean backup excluding heavy folders like node_modules, .next, etc.
"""

import os
import sys
import shutil
import glob
import subprocess
import json
from datetime import datetime
from pathlib import Path
from typing import List, Tuple, Optional
import argparse


class Colors:
    """ANSI color codes for terminal output"""
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color


class ProjectBackup:
    """Main backup class for FIGDREAM project"""
    
    def __init__(self, project_root: str = None):
        self.project_root = Path(project_root or os.getcwd()).resolve()
        self.project_name = self.project_root.name
        self.backup_base_dir = self.project_root.parent
        self.exclude_patterns = self._get_exclude_patterns()
        
    def _get_exclude_patterns(self) -> List[str]:
        """Define folders and files to exclude from backup"""
        return [
            # Dependencies and build artifacts
            "node_modules",
            ".next",
            "dist",
            "build",
            ".turbo",
            
            # Cache directories
            ".cache",
            ".npm",
            ".yarn",
            "yarn-error.log",
            
            # IDE and OS files
            ".vscode/settings.json",
            ".idea",
            ".DS_Store",
            "Thumbs.db",
            "*.swp",
            "*.swo",
            "*~",
            
            # Logs
            "*.log",
            "logs",
            "npm-debug.log*",
            "yarn-debug.log*",
            "yarn-error.log*",
            "lerna-debug.log*",
            
            # Runtime and temporary files
            ".env.local",
            ".env.*.local",
            "coverage",
            ".nyc_output",
            ".tmp",
            ".temp",
            
            # Git (optional - uncomment if you don't want git history)
            # ".git",
            
            # Supabase local (optional - these can be regenerated)
            # "supabase/.branches",
            # "supabase/logs",
        ]
    
    def _print_colored(self, message: str, color: str = Colors.NC):
        """Print colored message to terminal"""
        print(f"{color}{message}{Colors.NC}")
    
    def _check_project_root(self) -> bool:
        """Verify we're in the correct project directory"""
        claude_md = self.project_root / "CLAUDE.md"
        if not claude_md.exists():
            self._print_colored("❌ Must be run from project root (CLAUDE.md not found)", Colors.RED)
            return False
        return True
    
    def _get_timestamp(self) -> str:
        """Generate timestamp for backup folder"""
        return datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def _create_backup_name(self, timestamp: str) -> str:
        """Create backup folder name"""
        return f"{self.project_name}_backup_{timestamp}"
    
    def _get_source_size_mb(self) -> int:
        """Calculate approximate source size in MB"""
        try:
            result = subprocess.run(
                ["du", "-sk", str(self.project_root)],
                capture_output=True,
                text=True,
                check=True
            )
            size_kb = int(result.stdout.split()[0])
            return size_kb // 1024
        except (subprocess.CalledProcessError, ValueError, IndexError):
            return 0
    
    def _should_exclude(self, path: Path, relative_path: Path) -> bool:
        """Check if path should be excluded from backup"""
        path_str = str(relative_path)
        
        # Check exact matches and patterns
        for pattern in self.exclude_patterns:
            # Handle glob patterns
            if '*' in pattern:
                if pattern.endswith('*'):
                    prefix = pattern[:-1]
                    if path_str.startswith(prefix):
                        return True
                elif pattern.startswith('*'):
                    suffix = pattern[1:]
                    if path_str.endswith(suffix):
                        return True
                else:
                    # More complex glob pattern
                    if glob.fnmatch.fnmatch(path_str, pattern):
                        return True
            else:
                # Exact match or directory match
                if (path_str == pattern or 
                    path_str.startswith(pattern + "/") or 
                    path_str.startswith(pattern + os.sep)):
                    return True
        
        return False
    
    def _copy_with_exclusions(self, src: Path, dst: Path) -> bool:
        """Copy directory with exclusions using Python"""
        try:
            dst.mkdir(parents=True, exist_ok=True)
            
            for root, dirs, files in os.walk(src):
                root_path = Path(root)
                relative_root = root_path.relative_to(src)
                
                # Filter directories to exclude
                dirs[:] = [d for d in dirs if not self._should_exclude(
                    root_path / d, relative_root / d
                )]
                
                # Create directories
                for dir_name in dirs:
                    src_dir = root_path / dir_name
                    dst_dir = dst / relative_root / dir_name
                    if not dst_dir.exists():
                        dst_dir.mkdir(parents=True, exist_ok=True)
                
                # Copy files
                for file_name in files:
                    src_file = root_path / file_name
                    relative_file = relative_root / file_name
                    
                    if not self._should_exclude(src_file, relative_file):
                        dst_file = dst / relative_file
                        dst_file.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(src_file, dst_file)
            
            return True
        except Exception as e:
            self._print_colored(f"❌ Error during copy: {e}", Colors.RED)
            return False
    
    def _get_backup_size_mb(self, backup_path: Path) -> int:
        """Calculate backup size in MB"""
        try:
            result = subprocess.run(
                ["du", "-sk", str(backup_path)],
                capture_output=True,
                text=True,
                check=True
            )
            size_kb = int(result.stdout.split()[0])
            return size_kb // 1024
        except (subprocess.CalledProcessError, ValueError, IndexError):
            return 0
    
    def _create_backup_info(self, backup_path: Path, backup_size_mb: int, timestamp: str):
        """Create backup info file"""
        info_file = backup_path / "BACKUP_INFO.txt"
        
        # Get git information
        git_status = "Not a git repository"
        git_commit = "No git commit found"
        
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                check=True
            )
            git_status = result.stdout.strip() or "Clean working directory"
        except subprocess.CalledProcessError:
            pass
        
        try:
            result = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                check=True
            )
            git_commit = result.stdout.strip()
        except subprocess.CalledProcessError:
            pass
        
        # Get package.json info
        package_info = "No package.json found"
        package_json_path = self.project_root / "package.json"
        if package_json_path.exists():
            try:
                with open(package_json_path, 'r') as f:
                    package_data = json.load(f)
                    name = package_data.get('name', 'Unknown')
                    version = package_data.get('version', 'Unknown')
                    package_info = f'Name: {name}, Version: {version}'
            except (json.JSONDecodeError, KeyError):
                pass
        
        info_content = f"""FIGDREAM Project Backup
======================

Backup Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Original Path: {self.project_root}
Backup Path: {backup_path}
Backup Size: {backup_size_mb}MB

Excluded Patterns:
{chr(10).join(f'- {pattern}' for pattern in self.exclude_patterns)}

Git Status at Backup:
{git_status}

Git Commit at Backup:
{git_commit}

Package.json Info:
{package_info}
"""
        
        with open(info_file, 'w') as f:
            f.write(info_content)
        
        return info_file
    
    def _verify_backup_integrity(self, backup_path: Path) -> bool:
        """Verify backup integrity by checking key files and directories"""
        self._print_colored("\n🔍 Verifying backup integrity...", Colors.BLUE)
        
        success = True
        
        # Check key files
        key_files = ["CLAUDE.md", "package.json", "turbo.json"]
        for file_name in key_files:
            src_file = self.project_root / file_name
            dst_file = backup_path / file_name
            
            if src_file.exists() and dst_file.exists():
                self._print_colored(f"✅ {file_name}", Colors.GREEN)
            elif src_file.exists():
                self._print_colored(f"❌ {file_name} (missing in backup)", Colors.RED)
                success = False
        
        # Check key directories
        key_dirs = ["apps", "packages", "scripts"]
        for dir_name in key_dirs:
            src_dir = self.project_root / dir_name
            dst_dir = backup_path / dir_name
            
            if src_dir.exists() and dst_dir.exists():
                self._print_colored(f"✅ {dir_name}/", Colors.GREEN)
            elif src_dir.exists():
                self._print_colored(f"❌ {dir_name}/ (missing in backup)", Colors.RED)
                success = False
        
        return success
    
    def _show_backup_contents(self, backup_path: Path):
        """Show backup contents summary"""
        self._print_colored("\n📂 Backup contents summary:", Colors.BLUE)
        
        # Apps
        apps_dir = backup_path / "apps"
        if apps_dir.exists():
            apps = [d.name for d in apps_dir.iterdir() if d.is_dir()]
            self._print_colored("Apps:", Colors.BLUE)
            for app in apps:
                self._print_colored(f"  📱 {app}")
        else:
            self._print_colored("  📱 No apps directory", Colors.YELLOW)
        
        # Packages
        packages_dir = backup_path / "packages"
        if packages_dir.exists():
            packages = [d.name for d in packages_dir.iterdir() if d.is_dir()]
            self._print_colored("Packages:", Colors.BLUE)
            for package in packages:
                self._print_colored(f"  📦 {package}")
        else:
            self._print_colored("  📦 No packages directory", Colors.YELLOW)
        
        # Scripts
        scripts_dir = backup_path / "scripts"
        if scripts_dir.exists():
            scripts = [f.name for f in scripts_dir.iterdir() if f.is_file()]
            self._print_colored("Scripts:", Colors.BLUE)
            for script in scripts:
                self._print_colored(f"  🔧 {script}")
        else:
            self._print_colored("  🔧 No scripts directory", Colors.YELLOW)
    
    def _cleanup_old_backups(self, backup_name: str) -> int:
        """Clean up old backups, keeping only the last 10"""
        self._print_colored("\n🧹 Managing backup retention...", Colors.BLUE)
        
        backup_pattern = f"{self.project_name}_backup_*"
        backup_glob = self.backup_base_dir / backup_pattern
        
        old_backups = []
        for backup_path in backup_glob.glob("*"):
            if backup_path.is_dir() and backup_path.name != backup_name:
                old_backups.append(backup_path)
        
        # Sort by modification time (newest first)
        old_backups.sort(key=lambda x: x.stat().st_mtime, reverse=True)
        
        if len(old_backups) > 10:
            self._print_colored(f"Found {len(old_backups)} backups, keeping latest 10...", Colors.BLUE)
            
            # Remove oldest backups (keep 10)
            for old_backup in old_backups[10:]:
                self._print_colored(f"🗑️  Removing old backup: {old_backup.name}", Colors.YELLOW)
                shutil.rmtree(old_backup)
            
            self._print_colored("✅ Cleanup completed", Colors.GREEN)
            return len(old_backups) - 10
        else:
            self._print_colored(f"✅ Backup count ({len(old_backups)}) within retention limit (10)", Colors.GREEN)
            return 0
    
    def _show_available_backups(self):
        """Show available backups for this project"""
        self._print_colored("\n📚 Available backups for this project:", Colors.BLUE)
        
        backup_pattern = f"{self.project_name}_backup_*"
        backup_glob = self.backup_base_dir / backup_pattern
        
        backups = []
        for backup_path in backup_glob.glob("*"):
            if backup_path.is_dir():
                backups.append(backup_path)
        
        # Sort by modification time (newest first)
        backups.sort(key=lambda x: x.stat().st_mtime, reverse=True)
        
        for backup_path in backups[:5]:  # Show only 5 most recent
            try:
                result = subprocess.run(
                    ["du", "-sh", str(backup_path)],
                    capture_output=True,
                    text=True,
                    check=True
                )
                backup_size = result.stdout.split()[0]
            except subprocess.CalledProcessError:
                backup_size = "Unknown"
            
            # Parse timestamp from backup name
            timestamp_match = backup_path.name.split('_')[-2:]
            if len(timestamp_match) == 2:
                try:
                    date_part = timestamp_match[0]
                    time_part = timestamp_match[1]
                    formatted_date = f"{date_part[:4]}-{date_part[4:6]}-{date_part[6:8]} {time_part[:2]}:{time_part[2:4]}:{time_part[4:6]}"
                except (ValueError, IndexError):
                    formatted_date = "Unknown date"
            else:
                formatted_date = "Unknown date"
            
            self._print_colored(f"  💾 {backup_path.name} ({backup_size}) - {formatted_date}")
    
    def create_backup(self, interactive: bool = False) -> bool:
        """Main backup creation method"""
        self._print_colored("💾 FIGDREAM Project Backup", Colors.BLUE)
        self._print_colored("==========================", Colors.BLUE)
        
        # Check if we're in the right directory
        if not self._check_project_root():
            return False
        
        # Generate backup information
        timestamp = self._get_timestamp()
        backup_name = self._create_backup_name(timestamp)
        backup_path = self.backup_base_dir / backup_name
        
        self._print_colored(f"📁 Project: {self.project_name}", Colors.BLUE)
        self._print_colored(f"📅 Timestamp: {timestamp}", Colors.BLUE)
        self._print_colored(f"💾 Backup destination: {backup_path}", Colors.BLUE)
        print()
        
        # Show excluded patterns
        self._print_colored("🚫 Excluding the following patterns:", Colors.BLUE)
        for pattern in self.exclude_patterns:
            self._print_colored(f"  📂 {pattern}", Colors.YELLOW)
        print()
        
        # Calculate estimated size
        self._print_colored("📊 Calculating backup size...", Colors.BLUE)
        estimated_size = self._get_source_size_mb()
        self._print_colored(f"📏 Estimated backup size: ~{estimated_size}MB", Colors.BLUE)
        print()
        
        # Confirm backup creation
        if interactive:
            confirm = input(f"Create backup at {backup_path}? (Y/n): ").strip().lower()
            if confirm in ['n', 'no']:
                self._print_colored("🚫 Backup cancelled", Colors.YELLOW)
                return False
        
        # Create backup
        self._print_colored("📋 Creating backup...", Colors.BLUE)
        
        # Ensure backup directory exists
        self.backup_base_dir.mkdir(parents=True, exist_ok=True)
        
        # Perform the backup
        if self._copy_with_exclusions(self.project_root, backup_path):
            self._print_colored("\n✅ Backup created successfully!", Colors.GREEN)
            
            # Calculate actual backup size
            backup_size_mb = self._get_backup_size_mb(backup_path)
            
            self._print_colored(f"📁 Backup location: {backup_path}", Colors.GREEN)
            self._print_colored(f"📏 Actual backup size: {backup_size_mb}MB", Colors.GREEN)
            
            # Create backup info file
            info_file = self._create_backup_info(backup_path, backup_size_mb, timestamp)
            self._print_colored(f"📄 Backup info saved to: {info_file}", Colors.BLUE)
            
            # Verify backup integrity
            if self._verify_backup_integrity(backup_path):
                # Show backup contents
                self._show_backup_contents(backup_path)
                
                # Cleanup old backups
                self._cleanup_old_backups(backup_name)
                
                # Success summary
                self._print_colored("\n🎉 Backup completed successfully!", Colors.GREEN)
                self._print_colored("======================================", Colors.GREEN)
                self._print_colored(f"📁 Location: {backup_path}")
                self._print_colored(f"📏 Size: {backup_size_mb}MB")
                self._print_colored(f"📅 Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                self._print_colored("🔄 Retention: Keeping 10 most recent backups")
                
                # Show available backups
                self._show_available_backups()
                
                self._print_colored("\n💾 Backup process completed!", Colors.GREEN)
                return True
            else:
                self._print_colored("\n⚠️  Backup created but integrity check failed", Colors.YELLOW)
                return False
        else:
            self._print_colored("\n❌ Backup failed!", Colors.RED)
            self._print_colored("Check permissions and disk space", Colors.RED)
            return False


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="FIGDREAM Project Backup Script")
    parser.add_argument(
        "--project-root", 
        type=str, 
        help="Project root directory (default: current directory)"
    )
    parser.add_argument(
        "--interactive", 
        action="store_true", 
        help="Run with user confirmation prompts (default: non-interactive)"
    )
    
    args = parser.parse_args()
    
    # Create backup instance
    backup = ProjectBackup(args.project_root)
    
    # Run backup
    success = backup.create_backup(interactive=args.interactive)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
