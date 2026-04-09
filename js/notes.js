(function() {
    'use strict';

    const BASE_PATH = '../GoodNotes_extracted/GoodNotes/College/';
    const PDF_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
    const NOTEBOOK_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
    const CHEVRON = '<svg class="__CHV__" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    const FOLDER_ICON = '<svg class="folder-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>';

    // State
    let activeDept = 'all';
    let searchQuery = '';

    // DOM
    const browser = document.getElementById('notesBrowser');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const deptTabs = document.querySelectorAll('.dept-tab');

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Natural sort: "Lab 2" before "Lab 10"
    function naturalSort(a, b) {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    }

    // Check if a filename is the lab notebook (pin to top, emphasize)
    function isLabNotebook(filename) {
        return /lab\s*notebook/i.test(filename) || /notebook/i.test(filename);
    }

    // Sort files: lab notebooks first, then natural order
    function sortFiles(files) {
        return [...files].sort(function(a, b) {
            const aNb = isLabNotebook(a) ? 0 : 1;
            const bNb = isLabNotebook(b) ? 0 : 1;
            if (aNb !== bNb) return aNb - bNb;
            return naturalSort(a, b);
        });
    }

    // Count files recursively
    function countFiles(node) {
        let count = node.files ? node.files.length : 0;
        if (node.folders) {
            for (const f in node.folders) {
                count += countFiles(node.folders[f]);
            }
        }
        return count;
    }

    // Check if text matches search
    function matchesSearch(text) {
        if (!searchQuery) return true;
        return text.toLowerCase().includes(searchQuery.toLowerCase());
    }

    // Check if any file in a node matches search
    function nodeMatchesSearch(node, parentPath) {
        if (!searchQuery) return true;
        if (parentPath && matchesSearch(parentPath)) return true;
        for (const file of (node.files || [])) {
            if (matchesSearch(file)) return true;
        }
        for (const folderName in (node.folders || {})) {
            if (matchesSearch(folderName)) return true;
            if (nodeMatchesSearch(node.folders[folderName], folderName)) return true;
        }
        return false;
    }

    // Highlight search terms
    function highlightText(text) {
        if (!searchQuery) return escapeHtml(text);
        const escaped = escapeHtml(text);
        const query = escapeHtml(searchQuery);
        const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi');
        return escaped.replace(regex, '<span class="highlight">$1</span>');
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Clean filename for display
    function cleanName(filename) {
        return filename.replace(/\.pdf$/i, '');
    }

    // Render a single file item
    function renderFile(file, filePath) {
        const notebook = isLabNotebook(file);
        const icon = notebook ? NOTEBOOK_ICON : PDF_ICON;
        const cls = 'file-link' + (notebook ? ' file-link-notebook' : '');
        let html = '<li class="file-item' + (notebook ? ' file-item-notebook' : '') + '">';
        html += '<a href="' + encodeURI(filePath) + '" class="' + cls + '" target="_blank">';
        html += icon + '<span class="file-link-name">' + highlightText(cleanName(file)) + '</span>';
        if (notebook) html += '<span class="notebook-badge">Lab Notebook</span>';
        html += '</a></li>';
        return html;
    }

    // Render folder contents
    function renderFolder(folderName, node, basePath, depth) {
        if (!nodeMatchesSearch(node, folderName)) return '';

        const isOpen = !!searchQuery;
        const chevron = CHEVRON.replace('__CHV__', 'folder-chevron');
        let html = '<div class="folder-group">';
        html += '<div class="folder-header' + (isOpen ? ' open' : '') + '" onclick="this.classList.toggle(\'open\');this.nextElementSibling.classList.toggle(\'open\')">';
        html += chevron + FOLDER_ICON;
        html += '<span class="folder-name">' + highlightText(folderName) + '</span>';
        html += '</div>';
        html += '<div class="folder-body' + (isOpen ? ' open' : '') + '">';

        // Sub-folders (natural sort)
        for (const subFolder of Object.keys(node.folders || {}).sort(naturalSort)) {
            html += renderFolder(subFolder, node.folders[subFolder], basePath + '/' + subFolder, depth + 1);
        }

        // Files (notebooks first, then natural sort)
        if (node.files && node.files.length > 0) {
            let files = searchQuery
                ? node.files.filter(f => matchesSearch(f) || matchesSearch(folderName))
                : node.files;

            files = sortFiles(files);

            if (files.length > 0) {
                html += '<ul class="file-list">';
                for (const file of files) {
                    html += renderFile(file, basePath + '/' + file);
                }
                html += '</ul>';
            }
        }

        html += '</div></div>';
        return html;
    }

    // Render a course
    function renderCourse(dept, semester, courseName, node) {
        const searchText = courseName + ' ' + semester;
        if (!nodeMatchesSearch(node, searchText)) return '';

        const fileCount = countFiles(node);
        const isOpen = !!searchQuery;
        const chevron = CHEVRON.replace('__CHV__', 'course-chevron');
        const basePath = BASE_PATH + semester + '/' + courseName;

        let html = '<div class="course-card">';
        html += '<div class="course-header' + (isOpen ? ' open' : '') + '" onclick="this.classList.toggle(\'open\');this.nextElementSibling.classList.toggle(\'open\')">';
        html += chevron;
        html += '<span class="course-dept-badge ' + dept + '">' + dept + '</span>';
        html += '<span class="course-name">' + highlightText(courseName) + '</span>';
        html += '<span class="course-file-count">' + fileCount + ' files</span>';
        html += '</div>';
        html += '<div class="course-body' + (isOpen ? ' open' : '') + '">';

        // Root-level files (notebooks first, then natural sort)
        if (node.files && node.files.length > 0) {
            let files = searchQuery
                ? node.files.filter(f => matchesSearch(f) || matchesSearch(courseName))
                : node.files;

            files = sortFiles(files);

            if (files.length > 0) {
                html += '<ul class="file-list">';
                for (const file of files) {
                    html += renderFile(file, basePath + '/' + file);
                }
                html += '</ul>';
            }
        }

        // Folders (natural sort)
        for (const folderName of Object.keys(node.folders || {}).sort(naturalSort)) {
            html += renderFolder(folderName, node.folders[folderName], basePath + '/' + folderName, 0);
        }

        html += '</div></div>';
        return html;
    }

    // Main render
    function render() {
        let html = '';
        let hasResults = false;

        // Collect all semesters across departments
        const allSemesters = new Set();
        const depts = activeDept === 'all' ? Object.keys(NOTES_DATA) : [activeDept];

        for (const dept of depts) {
            if (!NOTES_DATA[dept]) continue;
            for (const sem in NOTES_DATA[dept]) {
                allSemesters.add(sem);
            }
        }

        // Sort semesters newest first (natural sort)
        const sortedSemesters = Array.from(allSemesters).sort(naturalSort).reverse();

        for (const semester of sortedSemesters) {
            let coursesHtml = '';
            let courseCount = 0;

            for (const dept of [...depts].sort(naturalSort)) {
                if (!NOTES_DATA[dept] || !NOTES_DATA[dept][semester]) continue;
                for (const courseName of Object.keys(NOTES_DATA[dept][semester]).sort(naturalSort)) {
                    const courseHtml = renderCourse(dept, semester, courseName, NOTES_DATA[dept][semester][courseName]);
                    if (courseHtml) {
                        coursesHtml += courseHtml;
                        courseCount++;
                    }
                }
            }

            if (courseCount > 0) {
                hasResults = true;
                const isOpen = !!searchQuery || sortedSemesters.indexOf(semester) < 2; // auto-open newest 2
                const chevron = CHEVRON.replace('__CHV__', 'semester-chevron');

                html += '<div class="semester-group">';
                html += '<div class="semester-header' + (isOpen ? ' open' : '') + '" onclick="this.classList.toggle(\'open\');this.nextElementSibling.classList.toggle(\'open\')">';
                html += chevron;
                html += '<span class="semester-name">' + highlightText(semester) + '</span>';
                html += '<span class="semester-badge">' + courseCount + ' course' + (courseCount !== 1 ? 's' : '') + '</span>';
                html += '</div>';
                html += '<div class="semester-body' + (isOpen ? ' open' : '') + '">';
                html += coursesHtml;
                html += '</div></div>';
            }
        }

        browser.innerHTML = html;
        noResults.style.display = hasResults ? 'none' : 'block';
    }

    // Events
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const val = this.value.trim();
        clearBtn.style.display = val ? '' : 'none';
        searchTimeout = setTimeout(function() {
            searchQuery = val;
            render();
        }, 200);
    });

    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        render();
        searchInput.focus();
    });

    deptTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            deptTabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            activeDept = this.dataset.dept;
            render();
        });
    });

    // Init
    if (typeof NOTES_ENABLED !== 'undefined' && !NOTES_ENABLED) {
        browser.innerHTML = '<div class="notes-unavailable">'
            + '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'
            + '<h3>Notes not available</h3>'
            + '<p>These notes are stored locally and are not hosted publicly.<br>To enable, set <code>NOTES_ENABLED = true</code> in notes-data.js with the GoodNotes folder present.</p>'
            + '</div>';
        noResults.style.display = 'none';
        return;
    }
    render();

})();
