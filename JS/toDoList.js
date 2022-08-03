Vue.config.debug = true;
Vue.config.devtools = true;

Vue.component('todo-item', {
    props: ['title', 'completed', "index", "hide", "task_tag"],
    // 每個事項卡片template
    template: `
    <li class="todoItem"  v-bind:class="{ hide_task: hide }">
        <div class="taskCard">
            <button class="btn_general btn done"
                @click="$emit('toggle')">完成
            </button>

            <button class="btn_general btn delete"
                @click="$emit('delete')">刪除
            </button>

            <button class="btn_general btn edit"
                @click="app.editBox(index)">編輯
            </button>

            <button class="btn_general btn copy"
                @click="app.copyTask(index)">複製
            </button> 

            <span v-bind:class="{ completed: this.completed }">
                {{this.title}}
            </span>
        </div>
        <div class="taskTagContainer">
            <button class="btn_general btn tagBtn"
                @click = "app.openTaskTagPanel()"
            >+
            </button> 

            <div class="taskTagsRow">
                <div v-for="(_tag, tagIndex) in task_tag" :key="tagIndex" class="taskTag" @click="app.removeTaskTag(index, tagIndex)">{{ _tag }}</div>
            </div>
        </div> 
    </li>
    `,
});

Vue.component('task-tag', {
    props: [],
    // 每個事項的標籤管理
    template: `
        <div class="taskTag">
            1111
        </div>
    `,
});

const app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        search: '',
        todos: [{ title: '待處理項目', completed: true, hide: false, taskTag: ["tag2", "tag3"] }],
        inputTag: '',
        tagsArray: ['never', 'gonna', 'give', 'you', 'up'],
    },
    methods: {

        // 待辦事項CRUD控制
        addTodo() {
            if (!this.newTodo.trim()) return;
            this.todos.push({ title: this.newTodo, completed: false, hide: false, taskTag: ['never', 'gonna', 'give', 'you', 'up'] });
            this.newTodo = '';
        },

        // 完成狀態切換
        toggle(index) {
            this.todos[index].completed = !this.todos[index].completed;
        },

        deleteTodo(index) {
            this.todos.splice(index, 1);
        },

        clearTodos() {
            if (this.todos.length < 1) return;
            if (confirm('確認清除所有事項?')) {
                this.todos = [];
            }
        },

        // 文字單向編輯
        editBox(index) {
            document.querySelector(".ck-editor__main p").innerHTML = this.todos[index].title;
        },

        // 複製事項
        copyTask(index) {
            this.todos.push({ 
                title: this.todos[index].title, 
                completed: this.todos[index].completed,
                hide: this.todos[index].hide,
                taskTag: this.todos[index].taskTag
            });
        },

        // 搜尋
        searchText() {
            // 若沒有輸入則全部顯示代辦事項
            if (this.search.length == 0) {
                for (let i = 0; i < this.todos.length; i++) {
                    this.todos[i].hide = false;
                }
            } else {
            // 使用者輸入後開始一個一個比對, 有含關鍵字就顯示, 反之則隱藏
                for (let i = 0; i < this.todos.length; i++) {
                    if (this.todos[i].title.includes(this.search)) {
                        this.todos[i].hide = false;
                    } else {
                        this.todos[i].hide = true;
                    }
                }
            }
        },

        // 待辦事項狀態篩選功能
        taskFilter() {
            let completedTask = document.getElementById("completedTask");
            let newTask = document.getElementById("newTask");
            let caseSwtich = "both";

            // 判斷選取類型 再去switch後續處理
            if (completedTask.checked && newTask.checked) {
                caseSwtich = "both";
            } else if (completedTask.checked && !newTask.checked) {
                caseSwtich = "completedTask";
            } else if (!completedTask.checked && newTask.checked) {
                caseSwtich = "newTask";
            } else {
                caseSwtich = "noneOfAll";
            };

            switch (caseSwtich) {
                case "both":
                    for (let i = 0; i < this.todos.length; i++) {
                        this.todos[i].hide = false;
                    }
                break;

                case "completedTask":
                    for (let i = 0; i < this.todos.length; i++) {
                        if (this.todos[i].completed) {
                            this.todos[i].hide = false;
                        } else {
                            this.todos[i].hide = true;
                        }
                    }
                break;

                case "newTask":
                    for (let i = 0; i < this.todos.length; i++) {
                        if (!this.todos[i].completed) {
                            this.todos[i].hide = false;
                        } else {
                            this.todos[i].hide = true;
                        }
                    }
                break;

                case "noneOfAll":
                    for (let i = 0; i < this.todos.length; i++) {
                        this.todos[i].hide = true;
                    }
                break;
            }
        },

        // 佈景主題切換
        themeSwitcher(e) {
            const themeStatus = document.querySelector('.theme-switch-wrapper p');
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeStatus.innerHTML = "Dark Mode";
            }
            else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeStatus.innerHTML = "Light Mode";
            }
        },

        // 標籤顯示面板
        openTagPanel(tirgger=0){
            // 觸發對象: 0: 預設, 1: tagCreator, 2: tag按鈕
            let tagPanel = document.getElementById("tagsBox");

            switch (tirgger) {
                case 0:
                    if (tagPanel.style.display == "none" | tagPanel.style.display == ""){
                        tagPanel.style.display = "block";
                    }else{
                        tagPanel.style.display = "none";
                    };
                break;

                case 1:
                    let tagCreator = document.getElementById("tagCreator");
                    if ( document.activeElement == tagCreator){
                        tagPanel.style.display = "block";
                    }else{
                        tagPanel.style.display = "none";
                    };
                break;

                case 2:
                    let tagBtn = document.querySelectorAll(".tagCreator button");
                    for(let i=0; i<tagBtn.length;i++){
                        if( document.activeElement ==  tagBtn[i]){
                            tagPanel.style.display = "block";
                            return;
                        };
                    };
                    tagPanel.style.display = "none";
                break;
                // 標籤版面會閃跳原因是 當使用者離開輸入框, 再按下新增按鈕時, 此時事件順序為 blur input > somewhere > add/remove Btn
                // 中間沒辦法用是否按兩個按鈕來判斷, 中間還是有一個事件
            }
        },

        addTag(inputTag){
            this.tagsArray.push(inputTag);
        },

        removeTag(index){
            this.tagsArray.splice(index, 1);
        },

        tagExists(inputTag){
            return this.tagsArray.indexOf(inputTag) !== -1;
        },

        createTag(){
            if ( !this.tagExists(this.inputTag) && !this.inputTag == "") {
                this.tagsArray.push(this.inputTag);
                this.inputTag = '';
            }else{
                window.alert("標籤為空白或已存在");
                this.inputTag = '';
            }
        },

        deleteAllTag(){
            if (this.tagsArray.length < 1) return;
            if (confirm('確認清除所有標籤?')) {
                this.tagsArray = [];
            } 
        },

        // 個別待辦事項標籤控制
        openTaskTagPanel(){
            let taskTagPanel = document.getElementById("taskTagBox");
            if (taskTagPanel.style.display == "none" | taskTagPanel.style.display == ""){
                taskTagPanel.style.display = "block";
            }else{
                taskTagPanel.style.display = "none";
            };
        },

        removeTaskTag(taskIndex, tagIndex){
            this.todos[taskIndex].taskTag.splice(tagIndex, 1);
        }

    },
    mounted() {
        // let taskLocalData = localStorage.setItem('taskLocalData', '');
        // taskLocalData = localStorage.getItem('taskLocalData');
        // // check data is exist or not
        // if (taskLocalData.length == 0){
        //     console.log("empty");
        // }else{
        //     console.log("exist");
        // }
    },
});
