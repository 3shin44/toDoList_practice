
Vue.component('todo-item', {
props: ['title', 'completed', "index", "hide"],
template: `
    <li v-bind:class="{ hide_task: hide }">
        <button class="btn_general btn done"
            v-on:click="$emit('toggle')">
            完成
        </button>
        <button class="btn_general btn delete"
            v-on:click="$emit('delete')">刪除
        </button>
        <button class="btn_general btn edit"
            v-on:click="app.editBox(index)">編輯
        </button>
        <button class="btn_general btn copy"
            v-on:click="app.copyTask(index)">複製
        </button>  
        <span v-bind:class="{ completed: this.completed }">
            {{this.title}}
        </span>
    </li>
    `,
});
Vue.config.devtools = true;
const app = new Vue({
el: '#app',
data: {
    newTodo: '',
    search: '',
    todos: [{ title: '待處理項目', completed: true, hide: false}]
    // todos: [{ title: 'Just a todo', completed: true, hide: false} ]
},
methods: {
    addTodo() {
    if (!this.newTodo.trim()) return;
    this.todos.push( { title: this.newTodo, completed: false, hide: false} );
    this.newTodo = '';
    },
    
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

    themeSwitcher(e){
        // 暫關閉localStorage功能

        const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
        // const currentTheme = localStorage.getItem('theme');
        const themeStatus = document.querySelector('.theme-switch-wrapper p');

        // if (currentTheme) {
        //     document.documentElement.setAttribute('data-theme', currentTheme);
        
        //     if (currentTheme === 'dark') {
        //         toggleSwitch.checked = true;
        //     }
        // }

        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            // localStorage.setItem('theme', 'dark');
            themeStatus.innerHTML = "Dark Mode";
        }
        else {        
            document.documentElement.setAttribute('data-theme', 'light');
            // localStorage.setItem('theme', 'light');
            themeStatus.innerHTML = "Light Mode";
        }

        // 呼叫函示功能已由VUE觸發, 事件聆聽不需使用 (確認後移除)
        // toggleSwitch.addEventListener('change', switchTheme, false);
    },

    editBox(index){
        document.querySelector(".ck-editor__main p").innerHTML = this.todos[index].title;
    },

    copyTask(index){
        this.todos.push({ title: this.todos[index].title, completed: this.todos[index].completed});
    },

    searchText(){
        if(this.search.length == 0){
            // 若沒有輸入則全部顯示代辦事項
            for(let i=0; i<this.todos.length; i++){
                this.todos[i].hide = false;
            }
        }else{
            // 使用者輸入後開始一個一個比對, 有含關鍵字就不隱藏, 不含就藏起來
            for(let i=0; i<this.todos.length; i++){
                if( this.todos[i].title.includes(this.search) ){
                    this.todos[i].hide = false;
                }else{
                    this.todos[i].hide = true;
                }
            }
        }
    },

    taskFilter(){
        let completedTask = document.getElementById("completedTask");
        let newTask = document.getElementById("newTask");   
        let caseSwtich = "both";

        // ugly method: 判斷選取類型 再去switch後續處理

        if ( completedTask.checked && newTask.checked){
            caseSwtich = "both";
        }else if (completedTask.checked && !newTask.checked) {
            caseSwtich = "completedTask";
        }else if (!completedTask.checked && newTask.checked) {
            caseSwtich = "newTask";
        }else{
            caseSwtich = "noneOfAll";
        };

        switch (caseSwtich) {
            case "both":
                for(let i=0; i<this.todos.length; i++){
                    this.todos[i].hide = false;
                }
            break;

            case "completedTask":
                for(let i=0; i<this.todos.length; i++){
                    if(this.todos[i].completed){
                        this.todos[i].hide = false;
                    }else{
                        this.todos[i].hide = true;
                    }  
                }
            break;

            case "newTask":
                for(let i=0; i<this.todos.length; i++){
                    if(!this.todos[i].completed){
                        this.todos[i].hide = false;
                    }else{
                        this.todos[i].hide = true;
                    }  
                }
            break;
        
            case "noneOfAll":
                for(let i=0; i<this.todos.length; i++){
                    this.todos[i].hide = true;
                }
            break;
        }

    }

}
});
