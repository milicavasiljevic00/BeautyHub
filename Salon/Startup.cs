using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Models;

namespace Salon
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR(e => {
                e.MaximumReceiveMessageSize = 102400000;
            });
            services.AddIdentity<AppUser,AppRole>(options=>
            {
                options.User.RequireUniqueEmail=true;
            }).AddRoles<AppRole>() //OVA LINIJA JE ZAJEBAVALA, NISU HTELE MIGRACIJE!!!!!!1
              .AddEntityFrameworkStores<BeautyContext>()
              .AddDefaultTokenProviders();;
                //.AddDefaultUI()

            services.AddDbContext<BeautyContext>(options=>
            {
                options.UseSqlServer(Configuration.GetConnectionString("BeautyCS"));
            });
            /*services.AddIdentity<AppUser,IdentityRole>(options=>
            {
                options.User.RequireUniqueEmail=true;
            })
              .AddEntityFrameworkStores<BeautyContext>()
              .AddDefaultTokenProviders();
                //.AddDefaultUI()*/

            
                
            //COOKIES????
            services.AddAuthentication(options=>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme=JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme=JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options=>
            {   
                options.SaveToken=true;
                options.RequireHttpsMetadata=false;
                options.TokenValidationParameters=new TokenValidationParameters()
                {
                    ValidateIssuer=true,
                    ValidateAudience=true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer=Configuration["JWT:ValidIssuer"],
                    ValidAudience=Configuration["JWT:ValidAudience"],
                    IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecretKey"]))
                };
            });

            
            
            services.AddCors(options => 
            {
                options.AddPolicy("CORS",builder =>
                {
                    builder.WithOrigins(new string[]
                    {
                        "http://localhost:8080",
                        "https://localhost:8080",
                        "http://127.0.0.1:8080",
                        "https://127.0.0.1:8080",
                        "http://127.0.0.1:5500",
                        "http://localhost:5500",
                        "https://127.0.0.1:5001",
                        "https://localhost:5001",
                        "https://localhost:3000",
                        "http://localhost:3000",
                        "https://localhost:3001",
                        "http://localhost:3001"

                    })
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();

                });
            });   

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { 
                    Title = "Salon", 
                    Version = "v1" ,
                    Description ="Authentication &  Authorization in ASP>NET Core 5.0 with JWT & Swagger"
                });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name="Authorization",
                    Type=SecuritySchemeType.ApiKey,
                    Scheme="Bearer",
                    BearerFormat="JWT",
                    In=ParameterLocation.Header,
                    Description="Enter `Bearer`[space] and then your valid token in the next input below"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference=new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        }
                        ,new string[]{}
                    }
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, BeautyContext context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Salon v1"));
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            

            app.UseRouting();

            app.UseCors("CORS");

            app.UseAuthorization();

            SeedData.Seed(userManager,roleManager,context);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<Notif>("/hubs/notif");
            });
            
        }
    }
}
