using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ReactSignalR.Server;

public class ImageUploadModel
{
    public string Base64Data { get; set; }
    public string Device { get; set; }
    public string User { get; set; }
    public string Pass { get; set; }
}

[ApiController]
[Route("[controller]")]
public class ImageUploadController : ControllerBase
{
    private readonly IHubContext<ImageHub> _hubContext;

    public ImageUploadController(IHubContext<ImageHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost("upload-base64")]
    public async Task<IActionResult> UploadBase64([FromBody] ImageUploadModel model)
    {
        if (string.IsNullOrEmpty(model.Base64Data))
            return BadRequest("Veri boş.");

        await _hubContext.Clients.All.SendAsync("ReceiveImage", model.Base64Data, model.Device, model.User, model.Pass);

        return Ok(new { message = "İşlem başarılı" });
    }
}