import { defineComponent } from 'vue';
import "./main.css"

export default defineComponent({
  setup(){

    return() => (
      <>
        <div class="flex gap-2 header-tag">
          <ElTag size="large" closable>Tag 1</ElTag>
          <ElTag size="large" closable>Tag 2</ElTag>
          <ElTag size="large" closable>Tag 3</ElTag>
          <ElTag size="large" closable>Tag 4</ElTag>
          <ElTag size="large" closable type="danger">Tag 5</ElTag>
        </div>      
      </>
    )
  }
})
