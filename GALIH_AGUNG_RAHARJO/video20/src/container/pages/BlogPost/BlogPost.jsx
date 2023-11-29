import React, { Component, Fragment } from 'react'
import "./BlogPost.css"
import Post from '../../../components/Post/Post'
import axios from "axios"

class BlogPost extends Component {
    state = {
        post: [],
        formBlogPost: {
            id: 1,
            title: '',
            body: '',
            useId: 1,
        },
        isUpdate: false
    }

    getPostAPI = () => {
        axios.get('http://localhost:3004/posts?_sort=id&_order=desc')
        .then((res) => {
            this.setState({
                post: res.data
            })
        })
    }

    postDataToAPI = () => {
        axios.post('http://localhost:3004/posts', this.state.formBlogPost).then((res) => {
            console.log(res)
            this.getPostAPI();
            this.setState({
                isUpdate: false,
                formBlogPost: {
                    id: 1,
                    title: '',
                    body: '',
                    useId: 1,
                }
            })
        }, (err) => {
            console.log('error', err);
        })
    }

    handleRemove = (data) => {
        console.log(data);
        axios.delete(`http://localhost:3004/posts/${data}`, this.state.formBlogPost)
        .then((res) => {
            this.getPostAPI();
        })
    }

    putDataToAPI = () => {
      axios.put(`http://localhost:3004/posts/${this.state.formBlogPost.id}`, this.state.formBlogPost)
        .then((res) => {
          console.log(res);
          this.getPostAPI();
          this.setState({
            isUpdate: false,
            formBlogPost: {
                id: 1,
                title: '',
                body: '',
                useId: 1,
            }
          })
        });
    }

    handleFormChange = (event) => {
        let formBlogPostNew = {...this.state.formBlogPost};
        let timestamp = new Date().getTime();
        if(!this.state.isUpdate){
            formBlogPostNew['id'] = timestamp;
        }
        formBlogPostNew[event.target.name] = event.target.value;
        this.setState({
            formBlogPost: formBlogPostNew
        }, () => {
            console.log("value obj form blog post", this.state.formBlogPost);
        })
    }

    handleUpdate = (data) => {
        console.log(data);
        this.setState({
            formBlogPost: data,
            isUpdate: true
        })
    }

    handleDetail = (id) => {
        console.log(id);
        this.props.history.push(`/detail-post/${id}`);
    }

    handleSubmit = () => {
        if(this.state.isUpdate){
            this.putDataToAPI();
        }else{
            this.postDataToAPI();
        }
    }

    componentDidMount() {
        this.getPostAPI();
    }
    
    render() {
        return (
            <Fragment>
                <p className='section-title'>Blog Post</p>
                <div className='container'>
                    <div className='form-add-post'>
                        <label htmlFor="title">Title</label>
                        <input type="text" value={this.state.formBlogPost.title} name='title' placeholder='add title' onChange={this.handleFormChange} />
                        <label htmlFor="body">Blog Content</label>
                        <textarea name="body" id="body" value={this.state.formBlogPost.body} cols="30" rows="10" onChange={this.handleFormChange}></textarea>
                        <button className='btn-submit' onClick={this.handleSubmit}>Simpan</button>
                    </div>
                </div>
                {
                    this.state.post.map(post => {
                        return <Post key={post.id} data={post} remove={this.handleRemove} update={this.handleUpdate} goDetail={this.handleDetail}/>
                    })
                }
            </Fragment>
        )
    }
}

export default BlogPost