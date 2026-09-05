```javascript
// ==========================================
// LEARNBUDDY - AI TEACHER
// ==========================================


// ==========================================
// ALL MAIN SECTIONS
// ==========================================

const sections = [
    "home",
    "ask",
    "lesson",
    "quiz",
    "assessment",
    "progress"
];

let currentSection = 0;


// ==========================================
// LESSON VARIABLES
// ==========================================

let lessonSlides = [];
let currentLessonSlide = 0;
let currentTopic = "";
let currentLessonText = "";
let currentUtterance = null;


// ==========================================
// SHOW SECTION
// ==========================================

function showSection(index, updateHash = true) {

    if (index < 0 || index >= sections.length) {
        return;
    }

    currentSection = index;

    sections.forEach((sectionId, i) => {

        const section = document.getElementById(sectionId);

        if (section) {

            section.classList.toggle(
                "active",
                i === index
            );

        }

    });

    const stepNumber =
        document.getElementById("stepNumber");

    if (stepNumber) {

        if (
            index === 2 &&
            lessonSlides.length > 0
        ) {

            stepNumber.textContent =
                `${currentLessonSlide + 1} / ${lessonSlides.length}`;

        } else {

            stepNumber.textContent =
                `${index + 1} / ${sections.length}`;

        }

    }

    const prevBtn =
        document.getElementById("prevBtn");

    if (prevBtn) {

        if (
            index === 2 &&
            lessonSlides.length > 0
        ) {

            prevBtn.disabled =
                currentLessonSlide === 0;

        } else {

            prevBtn.disabled =
                index === 0;

        }

    }

    const nextBtn =
        document.getElementById("nextBtn");

    if (nextBtn) {

        if (
            index === 2 &&
            lessonSlides.length > 0
        ) {

            nextBtn.disabled = false;

            if (
                currentLessonSlide ===
                lessonSlides.length - 1
            ) {

                nextBtn.textContent =
                    "Finish ✓";

            } else {

                nextBtn.textContent =
                    "Next →";

            }

        } else {

            nextBtn.disabled =
                index === sections.length - 1;

            nextBtn.textContent =
                "Next →";

        }

    }

    const dots =
        document.querySelectorAll(".dot");

    dots.forEach((dot, i) => {

        if (
            index === 2 &&
            lessonSlides.length > 0
        ) {

            dot.classList.toggle(
                "active",
                i === currentLessonSlide
            );

        } else {

            dot.classList.toggle(
                "active",
                i === index
            );

        }

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (updateHash) {

        window.history.replaceState(
            null,
            "",
            "#" + sections[index]
        );

    }

}


// ==========================================
// NEXT SECTION / NEXT LESSON
// ==========================================

function nextSection() {

    if (
        currentSection === 2 &&
        lessonSlides.length > 0
    ) {

        if (
            currentLessonSlide <
            lessonSlides.length - 1
        ) {

            currentLessonSlide++;

            displayLessonSlide();

            return;

        }

        stopSpeaking();

        alert(
            "🎉 Great job! You completed the lesson."
        );

        showSection(3);

        return;
    }

    if (
        currentSection <
        sections.length - 1
    ) {

        showSection(
            currentSection + 1
        );

    }

}


// ==========================================
// PREVIOUS SECTION / PREVIOUS LESSON
// ==========================================

function previousSection() {

    if (
        currentSection === 2 &&
        lessonSlides.length > 0
    ) {

        if (
            currentLessonSlide > 0
        ) {

            currentLessonSlide--;

            displayLessonSlide();

            return;

        }

        showSection(1);

        return;
    }

    if (currentSection > 0) {

        showSection(
            currentSection - 1
        );

    }

}


// ==========================================
// GO TO SECTION
// ==========================================

function goToSection(index) {

    if (
        index === 2 &&
        lessonSlides.length === 0
    ) {

        showSection(1);

        alert(
            "Please enter a topic in Ask AI first!"
        );

        return;
    }

    showSection(index);

}


// ==========================================
// START LEARNING
// ==========================================

function scrollToLearn() {

    showSection(1);

}


// ==========================================
// SET TOPIC
// ==========================================

function setTopic(topic) {

    const input =
        document.getElementById("topicInput") ||
        document.getElementById("questionInput");

    if (input) {

        input.value = topic;

    }

    startLesson();

}


// ==========================================
// START LESSON
// ==========================================

async function startLesson() {

    const topicInput =
        document.getElementById("topicInput") ||
        document.getElementById("questionInput");

    if (!topicInput) {

        alert("Please enter a topic first!");

        return;

    }

    const topic =
        topicInput.value.trim();

    if (!topic) {

        alert(
            "Please enter a topic first!"
        );

        return;

    }

    currentTopic = topic;

    lessonSlides = [];

    currentLessonSlide = 0;

    currentLessonText = "";

    stopSpeaking();

    const lessonContent =
        document.getElementById("lessonContent");

    const lessonStatus =
        document.getElementById("lessonStatus");

    if (lessonContent) {

        lessonContent.style.display = "block";

        lessonContent.textContent =
            "🤖 AI Teacher is preparing your lesson...";

    }

    if (lessonStatus) {

        lessonStatus.textContent =
            "Generating your lesson...";

    }

    showSection(2);

    try {

        const response =
            await fetch(
                "https://learnbuddy-xa2k.onrender.com/api/lesson",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic: topic
                    })
                }
            );

        if (!response.ok) {

            throw new Error(
                "Server error"
            );

        }

        const data =
            await response.json();

        if (
            data.lessons &&
            Array.isArray(data.lessons) &&
            data.lessons.length > 0
        ) {

            lessonSlides =
                data.lessons;

        }

        else if (data.lesson) {

            lessonSlides = [
                {
                    title: "Introduction",
                    content: data.lesson
                }
            ];

        }

        else {

            throw new Error(
                "No lesson content received"
            );

        }

        currentLessonSlide = 0;

        const lessonTopic =
            document.getElementById(
                "lessonTopic"
            );

        if (lessonTopic) {

            lessonTopic.textContent =
                topic;

        }

        const videoTitle =
            document.getElementById("videoTitle") ||
            document.getElementById("lessonVideoTitle");

        if (videoTitle) {

            videoTitle.textContent =
                "AI Lesson: " + topic;

        }

        const videoSubtitle =
            document.getElementById(
                "videoSubtitle"
            );

        if (videoSubtitle) {

            videoSubtitle.textContent =
                "Learn " +
                topic +
                " in a simple way";

        }

        const lessonHeading =
            document.getElementById(
                "lessonHeading"
            );

        if (lessonHeading) {

            lessonHeading.textContent =
                "Understanding " +
                topic;

        }

        displayLessonSlide();

    }

    catch (error) {

        console.error(
            "Lesson Error:",
            error
        );

        lessonSlides = [];

        currentLessonSlide = 0;

        currentLessonText = "";

        if (lessonContent) {

            lessonContent.style.display =
                "block";

            lessonContent.textContent =
                "⚠️ Unable to generate the lesson.";

        }

        if (lessonStatus) {

            lessonStatus.textContent =
                "Make sure the backend server is running.";

        }

    }

}


// ==========================================
// DISPLAY LESSON SLIDE
// ==========================================

function displayLessonSlide() {

    if (
        !lessonSlides ||
        lessonSlides.length === 0
    ) {

        return;

    }

    const slide =
        lessonSlides[
            currentLessonSlide
        ];

    if (!slide) {

        return;

    }

    const lessonContent =
        document.getElementById(
            "lessonContent"
        );

    const lessonStepTitle =
        document.getElementById(
            "lessonStepTitle"
        );

    const lessonStatus =
        document.getElementById(
            "lessonStatus"
        );

    const videoTitle =
        document.getElementById("videoTitle") ||
        document.getElementById("lessonVideoTitle");

    if (lessonStepTitle) {

        lessonStepTitle.textContent =
            slide.title || "Lesson";

    }

    if (lessonContent) {

        lessonContent.style.display =
            "block";

        lessonContent.textContent =
            slide.content || "";

    }

    currentLessonText =
        (
            slide.title || ""
        ) +
        ". " +
        (
            slide.content || ""
        );

    if (videoTitle) {

        videoTitle.textContent =
            currentTopic +
            " - " +
            (
                slide.title ||
                "AI Lesson"
            );

    }

    if (lessonStatus) {

        lessonStatus.textContent =
            `Lesson ${
                currentLessonSlide + 1
            } of ${
                lessonSlides.length
            }`;

    }

    updateLessonNavigation();

    stopSpeaking();

}


// ==========================================
// UPDATE LESSON NAVIGATION
// ==========================================

function updateLessonNavigation() {

    const stepNumber =
        document.getElementById(
            "stepNumber"
        );

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    if (stepNumber) {

        stepNumber.textContent =
            `${currentLessonSlide + 1} / ${lessonSlides.length}`;

    }

    if (prevBtn) {

        prevBtn.disabled =
            currentLessonSlide === 0;

    }

    if (nextBtn) {

        nextBtn.disabled = false;

        if (
            currentLessonSlide ===
            lessonSlides.length - 1
        ) {

            nextBtn.textContent =
                "Finish ✓";

        } else {

            nextBtn.textContent =
                "Next →";

        }

    }

    const dots =
        document.querySelectorAll(".dot");

    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentLessonSlide
            );

        }
    );

}


// ==========================================
// TEXT TO SPEECH
// ==========================================

function toggleSpeak() {

    const speakBtn =
        document.getElementById(
            "speakBtn"
        );

    if (
        !(
            "speechSynthesis"
            in window
        )
    ) {

        alert(
            "Sorry, your browser doesn't support voice reading."
        );

        return;

    }

    if (
        window.speechSynthesis.speaking
    ) {

        stopSpeaking();

        return;

    }

    if (!currentLessonText) {

        alert(
            "Generate a lesson first!"
        );

        return;

    }

    currentUtterance =
        new SpeechSynthesisUtterance(
            currentLessonText
        );

    currentUtterance.rate = 0.95;

    currentUtterance.pitch = 1;

    currentUtterance.onstart =
        function () {

            if (speakBtn) {

                speakBtn.textContent =
                    "⏸";

            }

            const lessonStatus =
                document.getElementById(
                    "lessonStatus"
                );

            if (lessonStatus) {

                lessonStatus.textContent =
                    "🔊 AI Teacher is reading the lesson...";

            }

        };

    currentUtterance.onend =
        function () {

            if (speakBtn) {

                speakBtn.textContent =
                    "▶";

            }

            const lessonStatus =
                document.getElementById(
                    "lessonStatus"
                );

            if (lessonStatus) {

                lessonStatus.textContent =
                    `Lesson ${
                        currentLessonSlide + 1
                    } of ${
                        lessonSlides.length
                    }`;

            }

        };

    window.speechSynthesis.speak(
        currentUtterance
    );

}


// ==========================================
// STOP SPEAKING
// ==========================================

function stopSpeaking() {

    if (
        "speechSynthesis"
        in window
    ) {

        window.speechSynthesis.cancel();

    }

    const speakBtn =
        document.getElementById(
            "speakBtn"
        );

    if (speakBtn) {

        speakBtn.textContent =
            "▶";

    }

}


// ==========================================
// ASK AI
// ==========================================

async function askAI() {

    const input =
        document.getElementById(
            "questionInput"
        );

    const answerBox =
        document.getElementById(
            "answerBox"
        );

    if (!input) {

        return;

    }

    const question =
        input.value.trim();

    if (!question) {

        if (answerBox) {

            answerBox.innerHTML =
                "⚠️ Please enter a topic.";

        }

        return;

    }

    currentTopic = question;

    lessonSlides = [];

    currentLessonSlide = 0;

    currentLessonText = "";

    stopSpeaking();

    if (answerBox) {

        answerBox.innerHTML = `
            <strong>🤖 Mia:</strong>
            <br><br>
            Preparing your AI lesson...
        `;

    }

    try {

        const response =
            await fetch(
                "https://learnbuddy-xa2k.onrender.com/api/lesson",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic: question
                    })
                }
            );

        if (!response.ok) {

            throw new Error(
                "Server error"
            );

        }

        const data =
            await response.json();

        if (
            data.lessons &&
            Array.isArray(data.lessons) &&
            data.lessons.length > 0
        ) {

            lessonSlides =
                data.lessons;

        }

        else if (data.lesson) {

            lessonSlides = [
                {
                    title: "Introduction",
                    content: data.lesson
                }
            ];

        }

        else {

            throw new Error(
                "No lesson content received"
            );

        }

        currentLessonSlide = 0;

        const lessonTopic =
            document.getElementById(
                "lessonTopic"
            );

        if (lessonTopic) {

            lessonTopic.textContent =
                question;

        }

        const lessonHeading =
            document.getElementById(
                "lessonHeading"
            );

        if (lessonHeading) {

            lessonHeading.textContent =
                "Understanding " +
                question;

        }

        const videoTitle =
            document.getElementById(
                "videoTitle"
            ) ||
            document.getElementById(
                "lessonVideoTitle"
            );

        if (videoTitle) {

            videoTitle.textContent =
                "AI Lesson: " +
                question;

        }

        const videoSubtitle =
            document.getElementById(
                "videoSubtitle"
            );

        if (videoSubtitle) {

            videoSubtitle.textContent =
                "Learn " +
                question +
                " in a simple way";

        }

        showSection(2);

        displayLessonSlide();

    }

    catch (error) {

        console.error(
            "Ask AI Error:",
            error
        );

        if (answerBox) {

            answerBox.innerHTML = `
                <strong>🤖 Mia:</strong>
                <br><br>
                ⚠️ Something went wrong.
                <br>
                Please make sure the backend server is running.
            `;

        }

    }

}


// ==========================================
// ENTER KEY FOR ASK AI
// ==========================================

function handleQuestionKey(event) {

    if (
        event.key === "Enter"
    ) {

        event.preventDefault();

        askAI();

    }

}


// ==========================================
// QUIZ
// ==========================================

function checkAnswer(
    button,
    correct
) {

    const options =
        button.parentElement
            .querySelectorAll("button");

    options.forEach(
        option => {

            option.disabled = true;

        }
    );

    if (correct) {

        button.classList.add(
            "correct"
        );

        button.innerHTML +=
            " ✓";

    } else {

        button.classList.add(
            "wrong"
        );

        button.innerHTML +=
            " ✗";

    }

}


// ==========================================
// ASSESSMENT
// ==========================================

function submitAssessment() {

    const answers = {

        a1: "class",
        a2: "main",
        a3: "int",
        a4: "//",
        a5: "extends"

    };

    let score = 0;

    let unanswered = 0;

    Object.keys(answers).forEach(
        name => {

            const selected =
                document.querySelector(
                    `input[name="${name}"]:checked`
                );

            if (!selected) {

                unanswered++;

            }

            else if (
                selected.value ===
                answers[name]
            ) {

                score++;

            }

        }
    );

    if (unanswered > 0) {

        const result =
            document.getElementById(
                "assessmentResult"
            );

        if (result) {

            result.innerHTML = `
                ⚠️ Please answer all 5 questions.
                <br>
                ${unanswered}
                question(s) remaining.
            `;

            result.className =
                "assessment-result";

        }

        return;

    }

    const percentage =
        Math.round(
            (score / 5) * 100
        );

    const scoreElement =
        document.getElementById(
            "assessmentScore"
        );

    if (scoreElement) {

        scoreElement.textContent =
            `${score} / 5`;

    }

    const progressText =
        document.getElementById(
            "assessmentProgress"
        );

    const progressFill =
        document.getElementById(
            "assessmentProgressFill"
        );

    if (progressText) {

        progressText.textContent =
            `${percentage}%`;

    }

    if (progressFill) {

        progressFill.style.width =
            `${percentage}%`;

    }

    const result =
        document.getElementById(
            "assessmentResult"
        );

    if (result) {

        if (score === 5) {

            result.innerHTML =
                "🎉 Excellent! You got 5 / 5. Great Job!";

            result.className =
                "assessment-result great-job";

        }

        else if (score >= 3) {

            result.innerHTML =
                `👏 Good job! You scored ${score} / 5. Keep learning!`;

            result.className =
                "assessment-result good-job";

        }

        else {

            result.innerHTML =
                `📚 You scored ${score} / 5. Revise the lesson and try again!`;

            result.className =
                "assessment-result try-again";

        }

    }

    document
        .querySelectorAll(
            "#assessment input"
        )
        .forEach(
            input => {

                input.disabled = true;

            }
        );

    const submitBtn =
        document.querySelector(
            "#assessment button"
        );

    if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.textContent =
            "Assessment Submitted ✓";

    }

}


// ==========================================
// FILE UPLOAD
// ==========================================

function setupFileUpload() {

    const fileInput =
        document.getElementById(
            "fileInput"
        );

    const fileName =
        document.getElementById(
            "fileName"
        );

    if (!fileInput) {

        return;

    }

    fileInput.addEventListener(
        "change",
        function () {

            if (
                fileName &&
                this.files.length > 0
            ) {

                fileName.textContent =
                    this.files[0].name;

            }

        }
    );

}


// ==========================================
// PLAY LESSON
// ==========================================

function playLesson() {

    if (
        lessonSlides.length > 0
    ) {

        showSection(2);

        displayLessonSlide();

    }

    else {

        showSection(1);

        alert(
            "Please enter a topic in Ask AI first!"
        );

    }

}


// ==========================================
// DEMO
// ==========================================

function showDemo() {

    alert(
        "🤖 Welcome to LearnBuddy AI Teacher!"
    );

}


// ==========================================
// LOAD SECTION FROM URL
// ==========================================

function loadSectionFromHash() {

    const hash =
        window.location.hash.replace(
            "#",
            ""
        );

    if (!hash) {

        showSection(
            0,
            false
        );

        return;

    }

    const index =
        sections.indexOf(hash);

    if (index !== -1) {

        if (
            index === 2 &&
            lessonSlides.length === 0
        ) {

            showSection(
                1,
                false
            );

            return;

        }

        showSection(
            index,
            false
        );

    }

    else {

        showSection(
            0,
            false
        );

    }

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSectionFromHash();

        setupFileUpload();

        const nextBtn =
            document.getElementById(
                "nextBtn"
            );

        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                nextSection
            );

        }

        const prevBtn =
            document.getElementById(
                "prevBtn"
            );

        if (prevBtn) {

            prevBtn.addEventListener(
                "click",
                previousSection
            );

        }

    }
);


// ==========================================
// BROWSER BACK / FORWARD
// ==========================================

window.addEventListener(
    "hashchange",
    function () {

        loadSectionFromHash();

    }
);
