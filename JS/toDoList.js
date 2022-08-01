
Vue.component('todo-item', {
props: ['title', 'completed'],
template: `
    <li>
        <button class="btn"
            v-bind:class="{ done: this.completed }"
            v-on:click="$emit('toggle')">
            完成
        </button>
        <button class="btn"
            v-bind:class="{ delete: this.completed }"
            v-on:click="$emit('delete')">刪除
        </button>
        <span v-bind:class="{ completed: this.completed }">
            {{this.title}}
        </span>
    </li>
    `,
});

const app = new Vue({
el: '#app',
data: {
    newTodo: '',
    search: '',
    todos: [{ title: 'Just a todo', completed: true} ]
},
methods: {
    addTodo() {
    if (!this.newTodo.trim()) return;
    this.todos.push({ title: this.newTodo, completed: false });
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
    }
}
});
