using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ReactTTTGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace ReactTTTGame.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WriteJsonController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;

        const string defautFileName = "animaltree.json";
        public WriteJsonController(IWebHostEnvironment hostingEnvironment, IConfiguration configuration)
        {
            _hostingEnvironment = hostingEnvironment;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult Get()
        {
            string fullPath = System.IO.Path.Combine(_hostingEnvironment.ContentRootPath, defautFileName);
            var json = System.IO.File.ReadAllText(fullPath);
            return Content(json);
        }


        [HttpPost]
        public IActionResult Post([FromBody] FileDto model)
        {
            //string pubData = @"ClientApp\Build\";  //In Prod this is the root folder for SPA.

            //if (_hostingEnvironment.IsDevelopment())
            //{
            //    pubData = @"ClientApp\public\";
            //}
            

            //string contentRootPath = _hostingEnvironment.ContentRootPath;

            //string directory = System.IO.Path.Combine(contentRootPath, pubData, model.Path);

            // TODO verify directory exists, Name is not null, Path is not null, Body is not null

            string fileName = String.IsNullOrEmpty(model.Name) ? defautFileName : model.Name;
            string fullPath = System.IO.Path.Combine(_hostingEnvironment.ContentRootPath, fileName);

            // simplest way to write to file
            System.IO.File.WriteAllText(fullPath, model.Body);

            return Created("data/animaltree.json", model);
        }


    }
}
