// Fonction pour charger le fichier JSON et afficher les questions
function chargerQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            const questionsContainer = document.getElementById('questionsContainer');

            // Stocker les questions chargées dans une variable globale
            window.questionsData = data;

            // Parcourir les questions dans le fichier JSON
            data.forEach((question, index) => {
                // Créer un élément de question
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                questionElement.innerHTML = `
                    <p>${question.question}</p>`;

                // Vérifier s'il y a plus d'une réponse possible
                const multipleChoices = Array.isArray(question.answer);

                // Ajouter les options de réponse avec des cases à cocher ou des boutons radio
                question.options.forEach((option, optionIndex) => {
                    const optionInput = document.createElement('input');
                    optionInput.type = multipleChoices ? 'checkbox' : 'radio';
                    optionInput.name = `question${index}`;
                    optionInput.value = optionIndex;

                    const optionLabel = document.createElement('label');
                    optionLabel.textContent = option;
                    optionLabel.insertBefore(optionInput, optionLabel.firstChild);

                    questionElement.appendChild(optionLabel);
                });

                // Ajouter l'élément de question au conteneur
                questionsContainer.appendChild(questionElement);
            });
        });
}

// Éviter que le formulaire ne soit soumis
document.getElementById('quizForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Vérifier si toutes les questions ont été répondues
    const questions = document.querySelectorAll('.question');
    let unansweredQuestion = false;

    questions.forEach((question, index) => {
        const selectedOptions = question.querySelectorAll(`input[name="question${index}"]:checked`);
        if (selectedOptions.length === 0) {
            unansweredQuestion = true;
        }
    });

    // Si au moins une question n'a pas été répondu, afficher une alerte
    if (unansweredQuestion) {
        alert('Veuillez répondre à toutes les questions.');
        return;
    }

    // Colorier les réponses avant d'évaluer
    colorierReponses();

    // Logique pour évaluer les réponses ici
    evaluerReponses(questionsData);
});


// Fonction pour colorier les réponses sélectionnées par l'utilisateur
function colorierReponses() {
    const questions = document.querySelectorAll('.question');

    questions.forEach((question, index) => {
        const correctAnswers = questionsData[index].answer;
        const isMultipleChoice = Array.isArray(correctAnswers);

        // Réinitialiser la couleur de tous les labels
        question.querySelectorAll('label').forEach(label => {
            label.style.color = '';
        });

        // Colorier toutes les réponses en fonction de leur exactitude
        question.querySelectorAll('label').forEach((label, optionIndex) => {
            if (isMultipleChoice) {
                if (correctAnswers.includes(optionIndex)) {
                    label.style.color = 'green'; // Réponse correcte, colorier en vert
                } else {
                    label.style.color = 'red'; // Réponse incorrecte, colorier en rouge
                }
            } else {
                if (correctAnswers === optionIndex) {
                    label.style.color = 'green'; // Réponse correcte, colorier en vert
                } else {
                    label.style.color = 'red'; // Réponse incorrecte, colorier en rouge
                }
            }
        });
    });
}

// Modifier la fonction evaluerReponses pour appeler colorierReponses après avoir calculé le score
function evaluerReponses(questionsData) {
    const questions = document.querySelectorAll('.question');
    let score = 0;

    questions.forEach((question, index) => {
        const selectedOptions = question.querySelectorAll(`input[name="question${index}"]:checked`);
        const selectedAnswers = Array.from(selectedOptions).map(option => parseInt(option.value));

        const correctAnswers = questionsData[index].answer;

        // Vérifier si la question a une réponse unique ou multiple
        const isMultipleChoice = Array.isArray(correctAnswers);

        if (isMultipleChoice) {
            // Gérer les questions à réponse multiple
            // Si au moins une réponse correcte est sélectionnée, ajouter un point
            if (selectedAnswers.length === correctAnswers.length && selectedAnswers.every(answer => correctAnswers.includes(answer))) {
                score++;
            }
        } else {
            // Gérer les questions à réponse unique
            if (selectedAnswers.length === 1 && selectedAnswers[0] === correctAnswers) {
                score++;
            }
        }
    });

    // Afficher le score sur la balise <p>
    document.getElementById('scoreDisplay').textContent = `Score : ${score}/${questions.length}`;
}

// Appel de la fonction pour charger les questions au chargement de la page
window.onload = chargerQuestions;
