
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;
using Models;

namespace Hubs
{
    public class Notif : Hub<INotifHub>
    {
        public async Task SendMessageToAll(int id, string idter, string opis, string dat, int tip) 
        {
            await Clients.Group(idter).SendMessageToAll(id,idter,opis,dat,tip); 
        }
        
        public async Task JoinGroup(string id)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId,id);
        }
        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}