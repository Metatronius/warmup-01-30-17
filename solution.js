const fs = require('fs');
const filename = process.argv[2];


fs.readFile(filename, 'utf8', function(err, data)
{
  if (err) throw err;
  let dataArr = data.split('\n');
  dataArr.pop();
  for (let i = 0; i < dataArr.length; i++)
  {
    dataArr[i] = toObj(dataArr[i]); //{unchangedBody, body, key, sectorID}
  }
  let realArr = dataArr.filter(isReal);
  for (var i = 0; i < realArr.length; i++)
  {
    console.log(realArr[i].decrypted = decrypt(realArr[i]), realArr[i].sectorID);
  }
});

function decrypt(data)
{
  let returnable = '';
  for (let i = 0; i < data.unchangedBody.length; i++)
  {
    returnable += decryptChar(data.unchangedBody[i], data.sectorID);
  }
  return returnable;
}

function decryptChar(data, key)
{
  if (data === '-')
  {
    return ' ';
  }
  const min = 'a'.charCodeAt(0);
  let returnable = data.charCodeAt(0);
  returnable = ((returnable - min + key) % 26) + min;
  return String.fromCharCode(returnable);
}

function toObj(data)
{
  let [body, key] = data.split('[');
  unchangedBody = body.replace(/[0-9]/g, '');
  unchangedBody = unchangedBody.substring(0, unchangedBody.length-1);
  key = key.replace(']', '');
  body = body.replace(/\W/g, '');
  let sectorID = +(body.replace(/[a-z]/g, ''));
  body = body.replace(/[0-9]/g, '');
  return {unchangedBody, body, key, sectorID};
}

function isReal(data)
{
  let counter = {};
  for (let i = 0; i < data.body.length; i++)
  {
    counter[data.body[i]] = (counter[data.body[i]] || 0) + 1;
  }
  let biggest = [-1, -1, -1, -1, -1];
  let chars = ['', '', '', '', ''];
  for (let key in counter)
  {
    for (let i = 0; i < biggest.length; i++)
    {
      if (counter[key] > biggest[i])
      {
        biggest.splice(i, 0, counter[key]);
        chars.splice(i, 0, key);
        biggest.pop();
        chars.pop();
        break;//if you have an issue with break replace this with i = 5
      }
      if(counter[key] === biggest[i])//we need to put these in alphabetically
      {
        if(key < chars[i])
        {
          biggest.splice(i, 0, counter[key]);
          chars.splice(i, 0, key);
        }
        else
        {
          biggest.splice(i + 1, 0, counter[key]);
          chars.splice(i + 1, 0, key);
        }
        biggest.pop();
        chars.pop();
        break;//see above comment about break
      }
    }
  }
  return chars.join('') === data.key;
}
