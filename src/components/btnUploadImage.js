

function UploadImage(props) {

    const onImageChange = (event) => {
        console.log("Upload onChange", event.target.files[0])
        if (event.target.files && event.target.files[0]) {
          props.setBgImg(URL.createObjectURL(event.target.files[0]))
        }
       }

    return (
            <label className="sidebtn">
                Upload image
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onImageChange}/>
            </label>
    )
}

export default UploadImage