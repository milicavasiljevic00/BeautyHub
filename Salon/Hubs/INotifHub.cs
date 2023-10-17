


using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;
using Models;

namespace Hubs
{
    public interface INotifHub
    {
         Task SendMessageToAll( int id, string idter, string opis,string dat, int tip);
          //Task SendMessageToAll(string id, string opis);
         Task JoinGroup(string name);
         Task RemoveFromGroup(string groupName);
    }
}