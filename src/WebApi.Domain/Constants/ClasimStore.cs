﻿using System.Collections.Generic;
using System.Security.Claims;

namespace WebApi.Domain.Constants
{
    public static class ClasimStore
    {
        public static List<Claim> claimList = new List<Claim>
        {
            new Claim(Claims.Create, Claims.Create),
            new Claim(Claims.Edit, Claims.Edit),
            new Claim(Claims.Delete, Claims.Delete),
        };
    }
}
