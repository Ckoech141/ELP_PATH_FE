globalThis['ngxConsoleFilter'] = (_level, _message) => {
    return true;
};
export class NgxConsole {
    log(message, reason) {
        if (globalThis['ngxConsoleFilter']('log', message)) {
            if (reason !== undefined) {
                console.log(message, reason);
            }
            else {
                console.log(message);
            }
        }
    }
    error(message, reason) {
        if (globalThis['ngxConsoleFilter']('error', message)) {
            if (reason !== undefined) {
                console.error(message, reason);
            }
            else {
                console.error(message);
            }
        }
    }
    warn(message, reason) {
        if (globalThis['ngxConsoleFilter']('warn', message)) {
            if (reason !== undefined) {
                console.warn(message, reason);
            }
            else {
                console.warn(message);
            }
        }
    }
}
globalThis['ngxConsole'] = new NgxConsole();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNvbnNvbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci9zcmMvbGliL29wdGlvbnMvbmd4LWNvbnNvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsVUFBVSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxNQUFjLEVBQUUsUUFBYSxFQUFXLEVBQUU7SUFDMUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFDRixNQUFNLE9BQU8sVUFBVTtJQUNkLEdBQUcsQ0FBQyxPQUFZLEVBQUUsTUFBWTtRQUNuQyxJQUFJLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRTtZQUNsRCxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQzlCO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDdEI7U0FDRjtJQUNILENBQUM7SUFDTSxLQUFLLENBQUMsT0FBWSxFQUFFLE1BQVk7UUFDckMsSUFBSSxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDcEQsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNoQztpQkFBTTtnQkFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3hCO1NBQ0Y7SUFDSCxDQUFDO0lBQ00sSUFBSSxDQUFDLE9BQVksRUFBRSxNQUFZO1FBQ3BDLElBQUksVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ25ELElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDL0I7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN2QjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJnbG9iYWxUaGlzWyduZ3hDb25zb2xlRmlsdGVyJ10gPSAoX2xldmVsOiBzdHJpbmcsIF9tZXNzYWdlOiBhbnkpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIHRydWU7XG59O1xuZXhwb3J0IGNsYXNzIE5neENvbnNvbGUge1xuICBwdWJsaWMgbG9nKG1lc3NhZ2U6IGFueSwgcmVhc29uPzogYW55KTogdm9pZCB7XG4gICAgaWYgKGdsb2JhbFRoaXNbJ25neENvbnNvbGVGaWx0ZXInXSgnbG9nJywgbWVzc2FnZSkpIHtcbiAgICAgIGlmIChyZWFzb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLCByZWFzb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBhbnksIHJlYXNvbj86IGFueSk6IHZvaWQge1xuICAgIGlmIChnbG9iYWxUaGlzWyduZ3hDb25zb2xlRmlsdGVyJ10oJ2Vycm9yJywgbWVzc2FnZSkpIHtcbiAgICAgIGlmIChyZWFzb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UsIHJlYXNvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwdWJsaWMgd2FybihtZXNzYWdlOiBhbnksIHJlYXNvbj86IGFueSk6IHZvaWQge1xuICAgIGlmIChnbG9iYWxUaGlzWyduZ3hDb25zb2xlRmlsdGVyJ10oJ3dhcm4nLCBtZXNzYWdlKSkge1xuICAgICAgaWYgKHJlYXNvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlLCByZWFzb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5nbG9iYWxUaGlzWyduZ3hDb25zb2xlJ10gPSBuZXcgTmd4Q29uc29sZSgpO1xuIl19