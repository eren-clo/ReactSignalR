using ReactSignalR.Server;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();




// Eren, mesaj boyutunu 20 MB yap
builder.Services.AddSignalR(options => {
    options.MaximumReceiveMessageSize = 20 * 1024 * 1024;
    options.EnableDetailedErrors = true; // Detaylı hata mesajları
}).AddHubOptions<ReactSignalR.Server.TravellerHub>(options => {
    options.EnableDetailedErrors = true;
});






builder.Services.AddCors(options => {
    options.AddPolicy("cors", policy =>
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowed(_ => true)
    );
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();


app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("cors");
app.MapControllers();



// Eren, SignalR Hub rotaları
app.MapHub<MerchantHub>("/merchantHub");
app.MapHub<TravellerHub>("/travellerHub");



app.MapFallbackToFile("/index.html");

app.Run("http://0.0.0.0:5000");
