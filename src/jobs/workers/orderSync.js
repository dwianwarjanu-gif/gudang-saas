queue.process(async job => {
  console.log("Processing order sync", job.data)
})