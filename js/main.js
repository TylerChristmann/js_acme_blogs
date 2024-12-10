// 1. createElemWithText
function createElemWithText(elementStr = "p", textContent = "", className = "") {
    const element = document.createElement(elementStr);
    element.textContent = textContent;
    if (className) {
        element.className = className;
    }
    return element;
}

// 2. createSelectOptions
function createSelectOptions(users) {
    if (!users) {
        return undefined;
    }
    const options = [];
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    });
    return options;
}

// 3. toggleCommentSection
function toggleCommentSection(postId) {
    if (!postId) return undefined;
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (!section) return null;
    section.classList.toggle("hide");
    return section;
}

// 4. toggleCommentButton
function toggleCommentButton(postId) {
    if (!postId) return undefined;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (button) {
        button.textContent =
            button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    }
    return button;
}

// 5. deleteChildElements
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return undefined;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

// 6. addButtonListeners
function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (buttons.length > 0) {
        buttons.forEach(button => {
            const postId = button.dataset.postId;
            if (postId) {
                button.addEventListener("click", event => {
                    toggleComments(event, postId);
                });
            }
        });
    }
    return buttons;
}

// 7. removeButtonListeners
function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener("click", event => {
                toggleComments(event, postId);
            });
        }
    });
    return buttons;
}

// 8. createComments
function createComments(comments) {
    if (!Array.isArray(comments)) return undefined;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const pBody = createElemWithText("p", comment.body);
        const pEmail = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, pBody, pEmail);
        fragment.appendChild(article);
    });
    return fragment;
}

// 9. populateSelectMenu
function populateSelectMenu(users) {
    if (!Array.isArray(users)) return undefined;
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);
    if (options) {
        options.forEach(option => selectMenu.appendChild(option));
    }
    return selectMenu;
}

// 10. getUsers
async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// 11. getUserPosts
async function getUserPosts(userId) {
    if (!userId) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return [];
    }
}

// 12. getUser
async function getUser(userId) {
    if (!userId) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

// 13. getPostComments
async function getPostComments(postId) {
    if (!postId) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

// 14. displayComments
async function displayComments(postId) {
    if (!postId) return undefined;
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    return section;
}

// 15. createPosts
async function createPosts(posts) {
    if (!Array.isArray(posts)) return undefined;
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement("article");
        const postTitle = createElemWithText("h2", post.title);
        const postBody = createElemWithText("p", post.body);
        const postId = createElemWithText("p", `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const authorInfo = createElemWithText(
            "p",
            `Author: ${author.name} with ${author.company.name}`
        );
        const authorCatchphrase = createElemWithText("p", author.company.catchPhrase);
        const showCommentsButton = document.createElement("button");
        showCommentsButton.textContent = "Show Comments";
        showCommentsButton.dataset.postId = post.id;
        const commentsSection = await displayComments(post.id);
        article.append(postTitle, postBody, postId, authorInfo, authorCatchphrase, showCommentsButton, commentsSection);
        fragment.appendChild(article);
    }
    return fragment;
}

// 16. displayPosts
async function displayPosts(posts) {
    const mainElement = document.querySelector("main");
    deleteChildElements(mainElement);
    const element = posts && posts.length > 0
        ? await createPosts(posts)
        : createElemWithText("p", "Select an Employee to display their posts.", "default-text");
    mainElement.appendChild(element);
    return element;
}

// 17. toggleComments
function toggleComments(event, postId) {
    if (!event || !postId) return undefined;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

// 18. refreshPosts
async function refreshPosts(posts) {
    if (!posts) return undefined;
    const removeButtons = removeButtonListeners();
    const mainElement = document.querySelector("main");
    const main = deleteChildElements(mainElement);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
}

// 19. selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
    if (!event) return undefined;
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = parseInt(selectMenu.value) || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}

// 20. initPage
async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

// 21. initApp
function initApp() {
    initPage().then(([users, select]) => {
        const selectMenu = document.getElementById("selectMenu");
        selectMenu.addEventListener("change", selectMenuChangeEventHandler);
    });
}

document.addEventListener("DOMContentLoaded", initApp);
