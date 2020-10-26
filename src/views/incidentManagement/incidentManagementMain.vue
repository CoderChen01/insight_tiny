<template>
  <div class="incident-management-root">
    <management-style>
      <template v-slot:manamgeMain>
        <incident></incident>
      </template>
    </management-style>
  </div>
</template>

<script>
  import incident from 'components/content/incidentManagement/incident'
  import managementStyle from 'components/common/managementStyle'
  export default {
    name: "incidentManagementMain",
    components: {
      incident,
      managementStyle
    }
  }
</script>

<style scoped>

</style>