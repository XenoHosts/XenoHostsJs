# XenoHostsJS
XenoHostsJS is a Nodde.Js wrapper which interfaces with the XenoHosts API Server.


## Installation

From Folder:
```
npm install
```

## Example Usage:

```javascript
import { XenoHostsClient } from "./XenoHostsJs/index.js";


setTimeout(async () => {
    const client = new XenoHostsClient("api_key");
    console.log(await client.account.getUser("erikpdev"))
    console.log(await client.account.createUser("Admin", "erikxpmmp@gmail.com", "demo"))
    console.log(await client.account.verifyUser("5b1d0543f760331a7bfdb94fc384008a4c2171921e0e252df779cbe2fd34c834"))
}, 0)
```

## Documentation:
Being worked on.


## Note:
This wrapper isn't ready.