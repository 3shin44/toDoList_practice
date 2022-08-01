
Vue.component('todo-item', {
props: ['title', 'completed', "index", "displayStatus"],
template: `
    <li class="displayStatus" v-bind:class="{ displayStatus: this.displayStatus }">
        <button class="btn done"
            v-bind:class="{ done: this.completed }"
            v-on:click="$emit('toggle')">
            完成
        </button>
        <button class="btn delete"
            v-bind:class="{ delete: this.completed }"
            v-on:click="$emit('delete')">刪除
        </button>
        <button class="btn edit"
            v-on:click="app.editBox(index)">編輯
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
    todos: [{ title: 'Just a todo', completed: true, displayStatus: "show"} ]
},
methods: {
    addTodo() {
    if (!this.newTodo.trim()) return;
    this.todos.push({ title: this.newTodo, completed: false, displayStatus: "show"});
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
    if (confirm('Want to clear all todos?')) {
        this.todos = [];
    }
    },

    themeSwitcher(){
        let switcherBtn = document.getElementById("themeSwitcher");
        if(switcherBtn.innerHTML == "Light"){
            switcherBtn.innerHTML = "Dark";
        }
        else{
            switcherBtn.innerHTML = "Light";
        }
    },

    editBox(index){
        document.querySelector(".ck-editor__main p").innerHTML = this.todos[index].title;
    }
}
});
