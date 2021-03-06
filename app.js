var express = require("express")
var bodyParser = require('body-parser')
var path = require("path")
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')))
app.locals.moment = require('moment')
app.listen(port)

app.get('/',function(req,res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err)
		}
	

		res.render('index',{
			title:'首页',
			movies:movies
		})

	})
})

app.get('/movie/:id',function(req,res){
	var id = req.params.id

	Movie.findById(id, function(err,movie){
		if(err){
			console.log(err)
		}

		res.render('detail',{
		title:'详情页' + movie.title,
		movie:movie
	})
	})
})

app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'后台录入页',
		movie: {
			title:'',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})

app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'后台更新页',
				movie:movie
			})
		})
	}
})

app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	}else{
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			language: movieObj.language,
			country: movieObj.country,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster,
			year: movieObj.year,
		})

		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/' + movie._id)
		})
}
})

app.get('/admin/list',function(req,res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err)
		}
	

		res.render('list',{
			title:'后台列表页',
			movies:movies
		})
	})
})

app.delete('/admin/list',function(req,res){
	var id = req.query.id

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
})

console.log('start on port '+ port)