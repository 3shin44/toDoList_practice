Vue.config.debug = true;
Vue.config.devtools = true;

Vue.component('todo-item', {
    props: ["id", 'title', 'completed', "index", "hide", "task_tag"],
    methods: {
        delete_task_emit(taskId){
            this.$emit("delete_task_trans", taskId);
        },
        copy_task_emit(taskId){
            console.log(taskId);
            this.$emit("copy_task_trans", taskId);
        }
        
    },
    // 每個事項卡片template
    template: `
    <li class="todoItem" :class="{ hide_task: hide }">
        <div class="taskCard">
            <button class="btn_general btn done"
                @click="$emit('toggle')">完成
            </button>

            <button class="btn_general btn delete"
                @click="delete_task_emit(id)">刪除
            </button>

            <button class="btn_general btn edit"
                @click="app.editBox(index)">編輯
            </button>

            <button class="btn_general btn copy"
                @click="copy_task_emit(id)">複製
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
    props: ["task_tag"],
    // 每個事項的標籤管理
    template: `
        <div class="taskTag">
            demoTag
        </div>
    `,
});

const app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        search: '',
        todos: [], // 此為原始資料組
        demoTodo: [], // 此為展示用資料組
        inputTag: '',
        tagsArray: ['never', 'gonna', 'give', 'you', 'up'],
        idCounter: 0, // 類主鍵計數器

    },
    methods: {

        // 待辦事項CRUD控制
        addTodo() {
            if (!this.newTodo.trim()) return;
            this.idCounter ++;
            this.todos.push({ id: this.idCounter, title: this.newTodo, completed: false, hide: false, taskTag: [] });
            this.demoTodo.push({ id: this.idCounter, title: this.newTodo, completed: false, hide: false, taskTag: [] });
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

        deleteTask(taskId){
            
            // 找到對應的事項ID 陣列索引值
            let findArrayIndex = 0;
            for(let i=0; i<this.todos.length; i++){
                if(this.todos[i].id == taskId){
                    findArrayIndex = i;
                    break;
                }
            };
            this.todos.splice(findArrayIndex, 1);

        },

        // 編輯功能: 點擊後將文字帶入編輯器
        editBox(index) {

            let ckEditorContainer = document.querySelector(".ckEditorContainer");
            ckEditorContainer.style.display = "block";

            let ckEditorText = document.querySelector(".ck-editor__main p");
            ckEditorText.innerHTML = this.todos[index].title;

            let editBtnCancel = document.getElementById("editBtnCancel");
            editBtnCancel.addEventListener("click", ()=>{
                ckEditorContainer.style.display= "none";
            });

        },

        // 複製事項
        copyTask(taskId) {
            console.log("incoming id: ", taskId);
            let findArrayIndex = 0;
            for(let i=0; i<this.todos.length; i++){
                if(this.todos[i].id == taskId){
                    findArrayIndex = i;
                    break;
                }
            };
            console.log("target id: ", findArrayIndex);
            let replicateTask = JSON.stringify(this.todos[findArrayIndex]);
            replicateTask = JSON.parse(replicateTask);
            this.idCounter++;
            this.todos.push({ 
                id: this.idCounter,
                title: replicateTask.title, 
                completed: replicateTask.completed,
                hide: replicateTask.hide,
                taskTag: replicateTask.taskTag
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

            // 清除舊資料
            this.demoTodo = [];
            if (completedTask.checked && newTask.checked) {
                this.todos.forEach(element => {
                    this.demoTodo.push(element);
                });
            } else if (completedTask.checked && !newTask.checked) {      
                let filterArr = this.todos.filter(element =>{
                    return element.completed == true;
                });

                filterArr.forEach(element => {
                    this.demoTodo.push(element);
                });
            } else if (!completedTask.checked && newTask.checked) {
                let filterArr = this.todos.filter(element =>{
                    return element.completed == false;
                });
                filterArr.forEach(element => {
                    this.demoTodo.push(element);
                });
            } else {
                this.demoTodo = [];
            };
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

            // 透過vue bind去解決

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

        // 搜尋功能
        clearSearch(){
            this.search = "";
            for (let i = 0; i < this.todos.length; i++) {
                this.todos[i].hide = false;
            }
        },

        // 標籤功能 增/刪/重複檢查
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
        },

    },

    mounted() {
        let taskLocalData = localStorage.getItem('taskLocalData');
        // 檢查資料是否存在
        if (taskLocalData == null){
            taskLocalData = localStorage.setItem('taskLocalData', "");
        }else{
            let existDataArray = JSON.parse(taskLocalData);
            existDataArray.forEach( element => {
                this.todos.push(element);
                this.demoTodo.push(element);
            });
        }

        let idCounter = localStorage.getItem('idCounter');
        if (idCounter == null){
            idCounter = localStorage.setItem('idCounter', "0");
        }else{
            this.idCounter = parseInt(idCounter);
        }
    },

    watch: {
        todos: function(){
            // 清除現有資料
            localStorage.setItem('taskLocalData', '');
            // 寫入新資料
            localStorage.setItem('taskLocalData', JSON.stringify(this.todos));

            // 更新展示陣列
            this.demoTodo = [];
            this.todos.forEach( element => {
                this.demoTodo.push(element);
            });
        },
        idCounter: function(){
            // 清除現有資料
            localStorage.setItem('idCounter', '');
            // 寫入新資料
            localStorage.setItem('idCounter', this.idCounter);
        }
    },
});
