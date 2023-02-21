import styles from './index.module.css'


export default function Upload() {
  return (
    
     < div className={styles.contenedor}>
      <p className={styles.principal}> Subi tus imagenes que quieras compartir.</p>
      <input className={styles.input}
      id= "input"
        onChange={uploadPhoto}
        type="file"
        multiple 
        accept="image/png, image/jpeg"
      />
    </div>
   
    
  )
}

const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
  
  let files = e.target.files || [];
  for( let i = 0 ; i < files.length ; i++ ){
  
  const file = e.target.files?.[i]!
  const filename = encodeURIComponent(file.name) + Date.now()
  const fileType = encodeURIComponent(file.type)

  const res = await fetch(
    `/api/upload-url?file=${filename}&fileType=${fileType}`
  )
  const { url, fields } = await res.json()
  const formData = new FormData()

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string)
    
  })

  
  fetch(url, {
    method: 'POST',
    body: formData,
    mode: 'no-cors'
   }
  )
.then(res => {alert(`archivo cargado ( ${i + 1} )` )

if (i == files.length -1 ) {
 let limpiar  =(document.getElementById('input') as HTMLInputElement)
 limpiar.value = ""
}

})


}

}




  
