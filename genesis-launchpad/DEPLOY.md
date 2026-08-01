# Deploying Genesis LP to IONOS

This is a **static website** (plain HTML/CSS/JS). No Node server needed — it works
on any basic web hosting, including IONOS.

## Rebuild the site (only when you change the code)

```bash
npm run build --prefix /Users/sanjitaleti/Documents/genesis_website/genesis-launchpad
```

This regenerates the `out/` folder. To repackage the zip:

```bash
cd /Users/sanjitaleti/Documents/genesis_website/genesis-launchpad/out
zip -r -q ../genesis-lp-site.zip .
```

The upload file is: `genesis-launchpad/genesis-lp-site.zip`

## Upload to IONOS (File Manager method — easiest)

1. Go to https://my.ionos.com and log in.
2. Click **Hosting** (or **Websites & Stores → Web Hosting**).
3. Open **File Manager** (sometimes under "Webspace" or "SFTP & File Manager").
4. Open your website's root folder — usually named `htdocs`, `html`, or your
   domain name. It may contain a default IONOS placeholder page.
5. **Delete** any default files already in there (e.g. an IONOS `index.html`
   "coming soon" page). Don't delete the folder itself.
6. Click **Upload** and choose `genesis-lp-site.zip`.
7. Right-click the uploaded zip → **Extract / Unzip** (into the current folder).
8. Confirm `index.html` is now sitting directly in the root folder (NOT inside a
   sub-folder). If it extracted into a folder, move the contents up one level.
9. Delete the leftover `genesis-lp-site.zip` from the server.

## Point your domain at it

- If the hosting is already tied to your domain: just visit your domain.
- If not: in IONOS go to **Domains**, pick your domain → **Connect to Hosting**
  / assign it to this web hosting package. DNS can take a few minutes to hours.

## Verify

Visit `https://yourdomain.com` — you should see the site.
Also check `https://yourdomain.com/features` etc. (trailing-slash routing is
already configured so these work as folders).
