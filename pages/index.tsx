export default function Upload() {
  return (
    <>
   <form action="/api/upload-url" method="POST" encType="multipart/form-data">
      <input type="file" name="file" />
      <input type="submit" className="btn btn-info" value="Enviar" ></input>
    </form>

   
    </>
  )
}




  
