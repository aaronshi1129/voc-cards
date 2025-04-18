        // All available decks
        const allDecks = {
            "Everyday Objects": [
                { term: "Chair", definition: "椅子", emoji: "🪑", mastered: false },
                 { term: "Table", definition: "桌子", emoji: "🛋️", mastered: false },
                 { term: "Pen", definition: "原子筆", emoji: "🖊️", mastered: false },
                 { term: "Pencil", definition: "鉛筆", emoji: "✏️", mastered: false },
                 { term: "Book", definition: "書本", emoji: "📚", mastered: false },
                 { term: "Phone", definition: "手機", emoji: "📱", mastered: false },
                 { term: "Computer", definition: "電腦", emoji: "💻", mastered: false },
                 { term: "Bag", definition: "包包", emoji: "👜", mastered: false },
                 { term: "Glasses", definition: "眼鏡", emoji: "👓", mastered: false },
                 { term: "Shoes", definition: "鞋子", emoji: "👟", mastered: false },
                 { term: "Towel", definition: "毛巾", emoji: "🧻", mastered: false },
                 { term: "Spoon", definition: "湯匙", emoji: "🥄", mastered: false },
                 { term: "Fork", definition: "叉子", emoji: "🍴", mastered: false },
                 { term: "Knife", definition: "刀子", emoji: "🔪", mastered: false },
                 { term: "Plate", definition: "盤子", emoji: "🍽️", mastered: false },
                 { term: "Cup", definition: "杯子", emoji: "☕", mastered: false },
                 { term: "Clock", definition: "時鐘", emoji: "🕰️", mastered: false },
                 { term: "Bed", definition: "床", emoji: "🛏️", mastered: false },
                 { term: "Pillow", definition: "枕頭", emoji: "🛌", mastered: false },
                 { term: "Blanket", definition: "毯子", emoji: "🧣", mastered: false },
                 { term: "Soap", definition: "肥皂", emoji: "🧼", mastered: false },
                 { term: "Toothbrush", definition: "牙刷", emoji: "🪥", mastered: false },
                 { term: "Toothpaste", definition: "牙膏", emoji: "🦷", mastered: false },
                 { term: "Mirror", definition: "鏡子", emoji: "🪞", mastered: false },
                 { term: "TV", definition: "電視", emoji: "📺", mastered: false },
                 { term: "Fan", definition: "電風扇", emoji: "🌀", mastered: false },
                 { term: "Light", definition: "燈", emoji: "💡", mastered: false },
                 { term: "Refrigerator", definition: "冰箱", emoji: "🧊", mastered: false },
                 { term: "Washing machine", definition: "洗衣機", emoji: "🧺", mastered: false },
                 { term: "Umbrella", definition: "雨傘", emoji: "🌂", mastered: false }
            ],
            "Spanish Greetings": [
                { term: "Hola", definition: "Hello", emoji: "👋", mastered: false },
                { term: "Buenos días", definition: "Good morning", emoji: "🌞", mastered: false },
                { term: "Buenas tardes", definition: "Good afternoon", emoji: "🌆", mastered: false },
                { term: "Buenas noches", definition: "Good evening/night", emoji: "🌙", mastered: false },
                { term: "Adiós", definition: "Goodbye", emoji: "👋", mastered: false },
                { term: "Hasta luego", definition: "See you later", emoji: "👋", mastered: false },
                { term: "¿Cómo estás?", definition: "How are you?", emoji: "🤔", mastered: false },
                { term: "Mucho gusto", definition: "Nice to meet you", emoji: "🤝", mastered: false },
                { term: "Por favor", definition: "Please", emoji: "🙏", mastered: false },
                { term: "Gracias", definition: "Thank you", emoji: "🙏", mastered: false }
            ]
        };
        
        // Flashcard mode variables
        let currentDeckName = "Everyday Objects";
        let currentDeck = [];
        let activeCards = []; // The cards for the current session (10 random or all)
        let currentCardIndex = 0;
        let isFlipped = false;
        const cardsPerSession = 10;
        let deckToDelete = ""; // Store the name of the deck to delete
        let showAllWords = false; // Toggle for showing all words or just 10 random ones
        
        // Quiz mode variables
        let currentMode = "flashcard"; // "flashcard" or "quiz"
        let quizQuestions = [];
        let currentQuizLength = 10; // Default quiz length
        let currentQuizIndex = 0;
        let quizScore = 0;
        let quizAnswers = []; // To store user's answers for the summary
        
        // Initialize the app when the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', init);
        
        // Initialize the app
        function init() {
            // Set up event listeners for all buttons and interactive elements
            setupEventListeners();
            
            // Initialize the deck buttons and load the first deck
            updateDeckButtons();
            loadDeck(currentDeckName);
            
            // Set default quiz length
            document.querySelector('.quiz-length-btn[data-length="10"]').classList.add('bg-indigo-600', 'text-white');
        }
        
        // Set up all event listeners
        function setupEventListeners() {
            // Actions dropdown menu
            document.getElementById('actions-btn').addEventListener('click', toggleActionsMenu);
            document.getElementById('view-all-btn').addEventListener('click', openWordListModal);
            document.getElementById('quiz-btn').addEventListener('click', openQuizModal);
            document.getElementById('import-btn').addEventListener('click', openImportModal);
            
            // Close actions menu when clicking outside
            document.addEventListener('click', function(event) {
                const actionsMenu = document.getElementById('actions-menu');
                const actionsBtn = document.getElementById('actions-btn');
                
                if (actionsMenu.classList.contains('show') && 
                    !actionsBtn.contains(event.target) && 
                    !actionsMenu.contains(event.target)) {
                    toggleActionsMenu();
                }
            });
            
            // Flashcard interaction
            document.getElementById('flashcard').addEventListener('click', flipCard);
            document.getElementById('prev-btn').addEventListener('click', prevCard);
            document.getElementById('next-btn').addEventListener('click', nextCard);
            document.getElementById('restart-btn').addEventListener('click', restartDeck);
            
            // Rating buttons
            document.getElementById('rate-1-btn').addEventListener('click', () => rateCard(1));
            document.getElementById('rate-2-btn').addEventListener('click', () => rateCard(2));
            document.getElementById('rate-3-btn').addEventListener('click', () => rateCard(3));
            
            // Mode tabs
            document.getElementById('flashcard-tab').addEventListener('click', () => switchMode('flashcard'));
            document.getElementById('quiz-tab').addEventListener('click', () => switchMode('quiz'));
            
            // Show all words toggle
            document.getElementById('show-all-toggle').addEventListener('change', toggleShowAllWords);
            
            // Quiz setup
            document.querySelectorAll('.quiz-length-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.quiz-length-btn').forEach(b => {
                        b.classList.remove('bg-indigo-600', 'text-white');
                        b.classList.add('bg-indigo-100', 'text-indigo-700');
                    });
                    this.classList.remove('bg-indigo-100', 'text-indigo-700');
                    this.classList.add('bg-indigo-600', 'text-white');
                    currentQuizLength = parseInt(this.dataset.length);
                    checkQuizLength();
                });
            });
            
            document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
            document.getElementById('quiz-next-btn').addEventListener('click', nextQuizQuestion);
            document.getElementById('quiz-finish-btn').addEventListener('click', showQuizResults);
            document.getElementById('new-quiz-btn').addEventListener('click', resetQuiz);
            document.getElementById('back-to-flashcards-btn').addEventListener('click', () => switchMode('flashcard'));
            
            // Modal controls
            document.getElementById('close-import-modal').addEventListener('click', closeImportModal);
            document.getElementById('cancel-import-btn').addEventListener('click', closeImportModal);
            document.getElementById('confirm-import-btn').addEventListener('click', importDeck);
            
            document.getElementById('close-word-list-modal').addEventListener('click', closeWordListModal);
            document.getElementById('close-word-list-btn').addEventListener('click', closeWordListModal);
            document.getElementById('word-search').addEventListener('input', function() {
                populateWordList(this.value);
            });
            
            document.getElementById('cancel-delete-btn').addEventListener('click', closeConfirmDeleteModal);
            // confirm-delete-btn is set dynamically when opening the modal
        }
        
        // Toggle actions menu
        function toggleActionsMenu() {
            const actionsMenu = document.getElementById('actions-menu');
            actionsMenu.classList.toggle('show');
        }
        
        // Toggle between showing all words or just 10 random ones
        function toggleShowAllWords() {
            showAllWords = document.getElementById('show-all-toggle').checked;
            loadDeck(currentDeckName); // Reload the deck with the new setting
        }
        
        // Switch between flashcard and quiz modes
        function switchMode(mode) {
            currentMode = mode;
            
            if (mode === 'flashcard') {
                document.getElementById('flashcard-tab').classList.add('active');
                document.getElementById('quiz-tab').classList.remove('active');
                document.getElementById('flashcard-mode').classList.remove('hidden');
                document.getElementById('quiz-mode').classList.add('hidden');
                document.getElementById('app-subtitle').textContent = 'Click the card to flip and reveal the translation';
                document.getElementById('app-instructions').classList.remove('hidden');
                document.getElementById('show-all-toggle-container').classList.remove('hidden');
            } else {
                document.getElementById('flashcard-tab').classList.remove('active');
                document.getElementById('quiz-tab').classList.add('active');
                document.getElementById('flashcard-mode').classList.add('hidden');
                document.getElementById('quiz-mode').classList.remove('hidden');
                document.getElementById('app-subtitle').textContent = 'Test your knowledge with multiple-choice questions';
                document.getElementById('app-instructions').classList.add('hidden');
                document.getElementById('show-all-toggle-container').classList.add('hidden');
                
                // Reset quiz UI to setup state
                resetQuiz();
                
                // Check if we have enough words for the quiz
                checkQuizLength();
            }
        }
        
        // Open the word list modal
        function openWordListModal() {
            document.getElementById('word-list-modal').style.display = 'block';
            document.getElementById('word-list-deck-name').textContent = currentDeckName;
            populateWordList();
            
            // Close actions menu
            document.getElementById('actions-menu').classList.remove('show');
        }
        
        // Close the word list modal
        function closeWordListModal() {
            document.getElementById('word-list-modal').style.display = 'none';
            document.getElementById('word-search').value = '';
        }
        
        // Populate the word list table
        function populateWordList(searchTerm = '') {
            const wordListBody = document.getElementById('word-list-body');
            wordListBody.innerHTML = '';
            
            const filteredWords = searchTerm 
                ? currentDeck.filter(card => 
                    card.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    card.definition.toLowerCase().includes(searchTerm.toLowerCase()))
                : currentDeck;
            
            filteredWords.forEach(card => {
                const row = document.createElement('tr');
                row.className = 'word-list-item';
                
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${card.term}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${card.definition}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-xl">${card.emoji}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${card.mastered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${card.mastered ? 'Mastered' : 'Learning'}
                        </span>
                    </td>
                `;
                
                wordListBody.appendChild(row);
            });
            
            if (filteredWords.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `
                    <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                        No words found matching "${searchTerm}"
                    </td>
                `;
                wordListBody.appendChild(emptyRow);
            }
        }
        
        // Check if the deck has enough words for the selected quiz length
        function checkQuizLength() {
            const deckSize = currentDeck.length;
            const quizWarning = document.getElementById('quiz-warning');
            const startQuizBtn = document.getElementById('start-quiz-btn');
            
            if (deckSize < currentQuizLength || deckSize < 4) { // Need at least 4 words for multiple choice
                quizWarning.classList.remove('hidden');
                startQuizBtn.disabled = true;
                startQuizBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                quizWarning.classList.add('hidden');
                startQuizBtn.disabled = false;
                startQuizBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
        
        // Open the quiz modal
        function openQuizModal() {
            switchMode('quiz');
            
            // Close actions menu
            document.getElementById('actions-menu').classList.remove('show');
        }
        
        // Open the import modal
        function openImportModal() {
            document.getElementById('import-modal').style.display = 'block';
            
            // Close actions menu
            document.getElementById('actions-menu').classList.remove('show');
        }
        
        // Close the import modal
        function closeImportModal() {
            document.getElementById('import-modal').style.display = 'none';
            document.getElementById('deck-name').value = '';
            document.getElementById('deck-content').value = '';
        }
        
        // Import a new deck from CSV
        function importDeck() {
            const deckName = document.getElementById('deck-name').value.trim();
            const deckContent = document.getElementById('deck-content').value.trim();
            
            if (!deckName) {
                alert('Please enter a deck name.');
                return;
            }
            
            if (!deckContent) {
                alert('Please enter flashcard content.');
                return;
            }
            
            // Parse the CSV content
            const lines = deckContent.split('\n');
            const newDeck = [];
            
            for (let line of lines) {
                line = line.trim();
                if (!line) continue;
                
                const [term, definition] = line.split(',').map(item => item.trim());
                
                if (term && definition) {
                    // Assign a default emoji based on the first letter of the term
                    const defaultEmojis = ['📝', '📚', '🔤', '📖', '🗣️', '💬', '🔠'];
                    const emoji = defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
                    
                    newDeck.push({
                        term,
                        definition,
                        emoji,
                        mastered: false
                    });
                }
            }
            
            if (newDeck.length === 0) {
                alert('No valid flashcards found. Please check your format.');
                return;
            }
            
            // Add the new deck
            allDecks[deckName] = newDeck;
            
            // Update the UI
            updateDeckButtons();
            
            // Load the new deck
            loadDeck(deckName);
            
            // Close the modal
            closeImportModal();
        }
        
        // Open the confirm delete modal
        function openConfirmDeleteModal(deckName) {
            deckToDelete = deckName;
            document.getElementById('confirm-delete-modal').style.display = 'block';
            document.getElementById('confirm-delete-btn').onclick = () => deleteDeck(deckToDelete);
        }
        
        // Close the confirm delete modal
        function closeConfirmDeleteModal() {
            document.getElementById('confirm-delete-modal').style.display = 'none';
            deckToDelete = "";
        }
        
        // Delete a deck
        function deleteDeck(deckName) {
            if (deckName && deckName !== "Everyday Objects" && deckName !== "Spanish Greetings") {
                // Delete the deck
                delete allDecks[deckName];
                
                // If the current deck is the one being deleted, switch to Everyday Objects
                if (currentDeckName === deckName) {
                    loadDeck("Everyday Objects");
                }
                
                // Update the deck buttons
                updateDeckButtons();
                
                // Close the modal
                closeConfirmDeleteModal();
            }
        }
        
        // Update the deck selection buttons
        function updateDeckButtons() {
            const deckButtonsContainer = document.getElementById('deck-buttons');
            deckButtonsContainer.innerHTML = '';
            
            Object.keys(allDecks).forEach(deckName => {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'deck-button-container';
                
                const button = document.createElement('button');
                button.className = `btn ${deckName === currentDeckName ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-indigo-700 hover:text-white font-medium py-2 px-4 rounded-lg text-sm`;
                button.textContent = deckName;
                button.addEventListener('click', () => loadDeck(deckName));
                
                const actions = document.createElement('div');
                actions.className = 'deck-actions';
                
                // Only allow deletion of custom decks (not the default decks)
                if (deckName !== "Everyday Objects" && deckName !== "Spanish Greetings") {
                    const deleteBtn = document.createElement('div');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.innerHTML = '×';
                    deleteBtn.title = 'Delete deck';
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent triggering the deck selection
                        openConfirmDeleteModal(deckName);
                    });
                    actions.appendChild(deleteBtn);
                }
                
                buttonContainer.appendChild(button);
                buttonContainer.appendChild(actions);
                deckButtonsContainer.appendChild(buttonContainer);
            });
        }
        
        // Load a deck and prepare it for use
        function loadDeck(deckName) {
            if (allDecks[deckName]) {
                currentDeckName = deckName;
                document.getElementById('current-deck-name').textContent = deckName;
                currentDeck = [...allDecks[deckName]]; // Create a copy of the deck
                
                // Select cards for the session based on the showAllWords toggle
                if (showAllWords) {
                    activeCards = [...currentDeck]; // Use all cards
                } else {
                    selectRandomCards(); // Select 10 random cards
                }
                
                // Update the deck buttons to show the active deck
                updateDeckButtons();
                
                // Reset to the first card
                currentCardIndex = 0;
                updateCard();
                
                // Update total cards count
                document.getElementById('total-cards').textContent = activeCards.length;
                
                // If in quiz mode, check quiz length
                if (currentMode === 'quiz') {
                    checkQuizLength();
                    resetQuiz();
                }
            }
        }
        
        // Select random cards for the current session
        function selectRandomCards() {
            // Shuffle the deck
            const shuffledDeck = [...currentDeck].sort(() => Math.random() - 0.5);
            
            // Take up to 10 cards
            activeCards = shuffledDeck.slice(0, Math.min(cardsPerSession, shuffledDeck.length));
        }
        
        // Update the current card display
        function updateCard() {
            if (activeCards.length === 0) return;
            
            const card = activeCards[currentCardIndex];
            document.getElementById('term').textContent = card.term;
            document.getElementById('definition').textContent = card.definition;
            document.querySelector('.flashcard-front span').textContent = card.emoji;
            
            // Update progress
            document.getElementById('progress-text').textContent = `${currentCardIndex + 1}/${activeCards.length}`;
            document.getElementById('progress-fill').style.width = `${((currentCardIndex + 1) / activeCards.length) * 100}%`;
            
            // Update mastered count
            const masteredCount = activeCards.filter(card => card.mastered).length;
            document.getElementById('mastered-count').textContent = masteredCount;
            
            // Reset card to front side
            isFlipped = false;
            document.getElementById('flashcard').classList.remove('flipped');
            document.getElementById('rating-buttons').style.opacity = '0';
            
            // Update button states
            document.getElementById('prev-btn').disabled = currentCardIndex === 0;
            document.getElementById('next-btn').disabled = currentCardIndex === activeCards.length - 1;
        }
        
        // Flip the flashcard
        function flipCard() {
            isFlipped = !isFlipped;
            document.getElementById('flashcard').classList.toggle('flipped');
            
            if (isFlipped) {
                // Show rating buttons when card is flipped to back
                setTimeout(() => {
                    document.getElementById('rating-buttons').style.opacity = '1';
                }, 300);
            } else {
                // Hide rating buttons when card is flipped to front
                document.getElementById('rating-buttons').style.opacity = '0';
            }
        }
        
        // Go to the previous card
        function prevCard() {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                updateCard();
            }
        }
        
        // Go to the next card
        function nextCard() {
            if (currentCardIndex < activeCards.length - 1) {
                currentCardIndex++;
                updateCard();
            }
        }
        
        // Rate the current card
        function rateCard(rating) {
            const card = activeCards[currentCardIndex];
            
            // Mark as mastered if rating is 3 (Knew It!)
            if (rating === 3) {
                card.mastered = true;
                
                // Update the original card in the deck
                const originalCardIndex = currentDeck.findIndex(c => c.term === card.term && c.definition === card.definition);
                if (originalCardIndex !== -1) {
                    currentDeck[originalCardIndex].mastered = true;
                }
                
                // Update mastered count
                const masteredCount = activeCards.filter(card => card.mastered).length;
                document.getElementById('mastered-count').textContent = masteredCount;
            }
            
            // Go to next card if available
            if (currentCardIndex < activeCards.length - 1) {
                nextCard();
            } else {
                // If this was the last card, just update the current card to show mastered status
                updateCard();
            }
        }
        
        // Restart the current deck
        function restartDeck() {
            // Reset mastered status for all cards in the active deck
            activeCards.forEach(card => card.mastered = false);
            
            // Reset to the first card
            currentCardIndex = 0;
            updateCard();
            
            // Update mastered count
            document.getElementById('mastered-count').textContent = '0';
        }
        
        // Start the quiz
        function startQuiz() {
            // Check if we have enough words
            if (currentDeck.length < currentQuizLength || currentDeck.length < 4) {
                alert('Not enough words in the deck for a quiz. Add more words or select a shorter quiz length.');
                return;
            }
            
            // Generate quiz questions
            generateQuizQuestions();
            
            // Reset quiz state
            currentQuizIndex = 0;
            quizScore = 0;
            quizAnswers = [];
            
            // Update UI
            document.getElementById('quiz-setup').classList.add('hidden');
            document.getElementById('quiz-questions').classList.remove('hidden');
            document.getElementById('quiz-results').classList.add('hidden');
            
            // Show first question
            showQuizQuestion();
        }
        
        // Generate quiz questions
        function generateQuizQuestions() {
            // Shuffle the deck
            const shuffledDeck = [...currentDeck].sort(() => Math.random() - 0.5);
            
            // Take the required number of cards for questions
            const questionCards = shuffledDeck.slice(0, currentQuizLength);
            
            // Create quiz questions
            quizQuestions = questionCards.map(card => {
                // Get 3 random incorrect options
                const incorrectOptions = getRandomIncorrectOptions(card.definition, 3);
                
                // Create options array with correct answer and incorrect options
                const options = [...incorrectOptions, card.definition];
                
                // Shuffle options
                const shuffledOptions = options.sort(() => Math.random() - 0.5);
                
                return {
                    term: card.term,
                    definition: card.definition,
                    emoji: card.emoji,
                    options: shuffledOptions,
                    correctIndex: shuffledOptions.indexOf(card.definition)
                };
            });
        }
        
        // Get random incorrect options for a quiz question
        function getRandomIncorrectOptions(correctAnswer, count) {
            // Get all definitions
            const allDefinitions = currentDeck.map(card => card.definition);
            
            // Filter out the correct answer
            const incorrectDefinitions = allDefinitions.filter(def => def !== correctAnswer);
            
            // Shuffle and take the required number
            return incorrectDefinitions
                .sort(() => Math.random() - 0.5)
                .slice(0, count);
        }
        
        // Show the current quiz question
        function showQuizQuestion() {
            const question = quizQuestions[currentQuizIndex];
            const quizProgressText = document.getElementById('quiz-progress-text');
            const quizProgressFill = document.getElementById('quiz-progress-fill');
            const quizScoreElement = document.getElementById('quiz-score');
            const quizQuestion = document.getElementById('quiz-question');
            const quizEmoji = document.getElementById('quiz-emoji');
            const quizOptions = document.getElementById('quiz-options');
            const quizNextBtn = document.getElementById('quiz-next-btn');
            const quizFinishBtn = document.getElementById('quiz-finish-btn');
            
            // Update progress
            quizProgressText.textContent = `${currentQuizIndex + 1}/${quizQuestions.length}`;
            quizProgressFill.style.width = `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%`;
            quizScoreElement.textContent = quizScore;
            
            // Update question
            quizQuestion.textContent = `What is the meaning of "${question.term}"?`;
            quizEmoji.textContent = question.emoji;
            
            // Clear previous options
            quizOptions.innerHTML = '';
            
            // Add options
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'quiz-option p-4 rounded-lg border border-gray-200 hover:border-indigo-500';
                optionElement.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-700 font-medium">
                            ${String.fromCharCode(65 + index)}
                        </div>
                        <span class="text-lg">${option}</span>
                    </div>
                `;
                optionElement.dataset.index = index;
                optionElement.addEventListener('click', selectQuizOption);
                quizOptions.appendChild(optionElement);
            });
            
            // Hide next/finish buttons
            quizNextBtn.classList.add('hidden');
            quizFinishBtn.classList.add('hidden');
        }
        
        // Handle quiz option selection
        function selectQuizOption(e) {
            const quizNextBtn = document.getElementById('quiz-next-btn');
            const quizFinishBtn = document.getElementById('quiz-finish-btn');
            const quizScoreElement = document.getElementById('quiz-score');
            
            // If already answered, do nothing
            if (quizNextBtn.classList.contains('hidden') && quizFinishBtn.classList.contains('hidden')) {
                const selectedOption = e.currentTarget;
                const selectedIndex = parseInt(selectedOption.dataset.index);
                const question = quizQuestions[currentQuizIndex];
                const isCorrect = selectedIndex === question.correctIndex;
                
                // Mark all options
                document.querySelectorAll('.quiz-option').forEach((option, index) => {
                    option.classList.add(index === question.correctIndex ? 'correct' : 'incorrect');
                    option.removeEventListener('click', selectQuizOption);
                });
                
                // Mark selected option
                selectedOption.classList.add('selected');
                
                // Update score if correct
                if (isCorrect) {
                    quizScore++;
                    quizScoreElement.textContent = quizScore;
                }
                
                // Store answer for summary
                quizAnswers.push({
                    term: question.term,
                    definition: question.definition,
                    emoji: question.emoji,
                    selectedIndex: selectedIndex,
                    correctIndex: question.correctIndex,
                    isCorrect: isCorrect
                });
                
                // Show next or finish button
                if (currentQuizIndex < quizQuestions.length - 1) {
                    quizNextBtn.classList.remove('hidden');
                } else {
                    quizFinishBtn.classList.remove('hidden');
                }
            }
        }
        
        // Move to the next quiz question
        function nextQuizQuestion() {
            currentQuizIndex++;
            showQuizQuestion();
        }
        
        // Show quiz results
        function showQuizResults() {
            document.getElementById('quiz-questions').classList.add('hidden');
            document.getElementById('quiz-results').classList.remove('hidden');
            
            const finalScore = document.getElementById('final-score');
            const finalPercentage = document.getElementById('final-percentage');
            const finalScoreBar = document.getElementById('final-score-bar');
            const quizSummary = document.getElementById('quiz-summary');
            
            // Update final score
            finalScore.textContent = `${quizScore}/${quizQuestions.length}`;
            const percentage = Math.round((quizScore / quizQuestions.length) * 100);
            finalPercentage.textContent = `${percentage}%`;
            finalScoreBar.style.width = `${percentage}%`;
            
            // Generate summary
            quizSummary.innerHTML = '';
            
            quizAnswers.forEach((answer, index) => {
                const card = document.createElement('div');
                card.className = `quiz-result-card p-4 ${answer.isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`;
                
                card.innerHTML = `
                    <div class="flex items-center mb-2">
                        <span class="text-2xl mr-2">${answer.emoji}</span>
                        <h4 class="text-lg font-semibold">${answer.term}</h4>
                    </div>
                    <p class="text-gray-700 mb-1">Correct: ${answer.definition}</p>
                    ${!answer.isCorrect ? `<p class="text-red-600">Your answer: ${quizQuestions[index].options[answer.selectedIndex]}</p>` : ''}
                `;
                
                quizSummary.appendChild(card);
            });
        }
        
        // Reset quiz to setup state
        function resetQuiz() {
            document.getElementById('quiz-setup').classList.remove('hidden');
            document.getElementById('quiz-questions').classList.add('hidden');
            document.getElementById('quiz-results').classList.add('hidden');
            checkQuizLength();
        }
