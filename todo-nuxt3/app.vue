<template>
  <div class="min-h-screen w-full bg-gray-100">
    <section id="heading" class="pt-7 text-center">
      <h1 class="text-4xl text-gray-800">What are we doing today?</h1>
    </section>
    <section id="form">
      <form
        @submit.prevent=""
        class="mx-auto mt-6 w-9/12 max-w-lg rounded-md bg-white px-12 py-5"
      >
        <div class="flex items-center space-x-4">
          <input
            type="text"
            class="flex-1 rounded-md border border-blue-200 px-4 py-2 focus:border-blue-400 focus:outline-none"
            placeholder="Add a todo"
          />
          <button
            class="rounded-md border border-blue-200 px-2 py-2 transition-colors duration-200 hover:bg-blue-200"
          >
            Add Todo
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
